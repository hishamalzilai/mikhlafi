"use server";

import { cookies, headers } from 'next/headers';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { signJWT, verifyJWT, getAdminJwtSecret } from '@/lib/jwt';
import { getClientIp } from '@/lib/ip';
import { cvSchema } from '@/lib/schemas';

// Rate limiting for login attempts (best-effort, in-memory only).
// In a multi-process/serverless environment this will not persist across
// invocations; use a persistent store (KV/Redis/DB) for strict protection.
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const MAX_LOGIN_ATTEMPTS_MAP_SIZE = 10000;

function cleanupLoginAttempts(now: number) {
  // Remove stale entries older than 2 lockout durations
  for (const [key, data] of loginAttempts.entries()) {
    if (now - data.lastAttempt > LOCKOUT_DURATION * 2) {
      loginAttempts.delete(key);
    }
  }

  // If still too large, prune the oldest 20%
  if (loginAttempts.size > MAX_LOGIN_ATTEMPTS_MAP_SIZE) {
    const entries = Array.from(loginAttempts.entries());
    entries.sort((a, b) => a[1].lastAttempt - b[1].lastAttempt);
    const pruneCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < pruneCount; i++) {
      loginAttempts.delete(entries[i][0]);
    }
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; lockoutMs: number } {
  const now = Date.now();
  cleanupLoginAttempts(now);

  const attempts = loginAttempts.get(ip);

  if (!attempts) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1, lockoutMs: 0 };
  }

  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1, lockoutMs: 0 };
  }

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const remainingLockout = LOCKOUT_DURATION - (now - attempts.lastAttempt);
    return { allowed: false, remainingAttempts: 0, lockoutMs: remainingLockout };
  }

  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count - 1, lockoutMs: 0 };
}

function recordLoginAttempt(ip: string) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
  } else {
    attempts.count += 1;
    attempts.lastAttempt = now;
  }
}

function clearLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

async function verifyAdminPassword(pass: string, adminPassHashEnv?: string): Promise<boolean> {
  if (adminPassHashEnv) {
    return bcrypt.compare(pass, adminPassHashEnv);
  }
  return false;
}

function maskEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function verifyAdmin(email: string, pass: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPassHash) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in environment variables!");
    return { success: false, error: 'خطأ في إعدادات النظام' };
  }

  // Rate limiting keyed by client IP (best-effort; in serverless use KV/D1 for strict limiting)
  const h = await headers();
  const clientIp = getClientIp(h);
  const rateLimitKey = clientIp;
  const rateCheck = checkRateLimit(rateLimitKey);

  if (!rateCheck.allowed) {
    const minutesLeft = Math.ceil(rateCheck.lockoutMs / 60000);
    return { 
      success: false, 
      error: `تم تجاوز الحد الأقصى لمحاولات الدخول. يرجى المحاولة بعد ${minutesLeft} دقيقة.` 
    };
  }

  // Timing-safe email comparison
  const emailMatch = email.length === adminEmail.length && 
    crypto.timingSafeEqual(Buffer.from(email), Buffer.from(adminEmail));

  const passMatch = await verifyAdminPassword(pass, adminPassHash);

  if (emailMatch && passMatch) {
    // Issue a signed JWT so the session is verifiable in any worker/process
    const jwtSecret = getAdminJwtSecret();
    if (!jwtSecret) {
      return { success: false, error: 'خطأ في إعدادات النظام' };
    }
    const sessionToken = await signJWT({ admin: true }, jwtSecret, 24 * 60 * 60);

    // Set a secure, httpOnly cookie with the signed token
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Clear rate limiting on successful login
    clearLoginAttempts(rateLimitKey);

    return { success: true };
  }

  // Record failed attempt
  recordLoginAttempt(rateLimitKey);

  // Generic error message (don't reveal which field was wrong)
  return { success: false, error: 'بيانات الدخول غير صحيحة' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function checkAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    
    if (!token) return false;
    
    const jwtSecret = getAdminJwtSecret();
    if (!jwtSecret) return false;
    
    const payload = await verifyJWT<{ admin: boolean }>(token, jwtSecret);
    if (!payload || !payload.admin) return false;
    
    return true;
  } catch (err) {
    console.error('[checkAdminSession] error:', err);
    return false;
  }
}

export async function getCvData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'cv.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function saveCvData(data: unknown) {
  // Security Check: Verify admin session
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بحفظ التغييرات.' };
  }

  try {
    const validatedData = cvSchema.parse(data);
    const filePath = path.join(process.cwd(), 'src', 'data', 'cv.json');
    fs.writeFileSync(filePath, JSON.stringify(validatedData, null, 2), 'utf8');
    return { success: true };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'issues' in e) {
      const zodErr = e as { issues?: { message: string }[] };
      return { success: false, error: zodErr.issues?.[0]?.message || 'بيانات السيرة الذاتية غير صالحة' };
    }
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function findDuplicatesAction(section: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك.' };
  }

  const validSections = ['articles', 'news', 'archive', 'testimonials'];
  if (!validSections.includes(section)) {
    return { success: false, error: 'قسم غير صالح.' };
  }

  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    
    // Fetch relevant fields to identify duplicates
    let items: any[] = [];
    
    if (section === 'testimonials') {
      const { data, error } = await supabaseAdmin
        .from('testimonials')
        .select('id, title, author_name, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      items = data || [];
    } else {
      const { data, error } = await supabaseAdmin
        .from(section)
        .select('id, title, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      items = data || [];
    }

    // Grouping logic (strong algorithm to find exact or near duplicates by title/name)
    const grouped = new Map<string, any[]>();
    for (const item of items) {
      let identifierKey = (item.title || item.author_name || 'بدون عنوان').trim();
      // Normalize spaces and lowercase for strict duplicate matching
      identifierKey = identifierKey.replace(/\s+/g, ' ').toLowerCase();
      
      if (!grouped.has(identifierKey)) {
        grouped.set(identifierKey, []);
      }
      grouped.get(identifierKey)!.push(item);
    }

    // Filter to only groups that have more than 1 item
    const duplicates = Array.from(grouped.entries())
      .filter(([_, items]) => items.length > 1)
      .map(([_, items]) => ({
        displayTitle: items[0].title || items[0].author_name || 'بدون عنوان',
        count: items.length,
        items
      }));

    return { success: true, duplicates };
  } catch (err: any) {
    console.error(`[findDuplicatesAction] error finding duplicates in ${section}:`, err);
    return { success: false, error: err.message || 'حدث خطأ أثناء البحث عن التكرارات' };
  }
}

export async function deleteSpecificItemsAction(section: string, ids: number[]) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بحذف البيانات.' };
  }

  const validSections = ['articles', 'news', 'archive', 'testimonials'];
  if (!validSections.includes(section)) {
    return { success: false, error: 'قسم غير صالح للحذف.' };
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return { success: false, error: 'لم يتم تحديد أي عناصر للحذف.' };
  }

  // Validate all IDs are finite positive integers and cap at 100
  const sanitizedIds = ids
    .filter((id): id is number => typeof id === 'number' && Number.isFinite(id) && Number.isInteger(id) && id > 0)
    .slice(0, 100);

  if (sanitizedIds.length === 0) {
    return { success: false, error: 'جميع المعرفات المحددة غير صالحة.' };
  }

  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    
    const { error } = await supabaseAdmin.from(section).delete().in('id', sanitizedIds);
    if (error) throw error;

    // Revalidate the affected paths
    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/${section}`);
    revalidatePath(`/hq-management-system/${section}`);

    return { success: true };
  } catch (err: any) {
    console.error(`[deleteSpecificItemsAction] error deleting from ${section}:`, err);
    return { success: false, error: err.message || 'حدث خطأ أثناء الحذف' };
  }
}
