"use server";

import { cookies } from 'next/headers';
import crypto from 'crypto';

// Generate a secure session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// In-memory store for valid session tokens (in production, use Redis/DB)
// This is server-side only, so it persists across requests in the same process
const validSessions = new Map<string, { createdAt: number }>();

// Clean up expired sessions periodically
function cleanExpiredSessions() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  for (const [token, session] of validSessions.entries()) {
    if (now - session.createdAt > maxAge) {
      validSessions.delete(token);
    }
  }
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; lockoutMs: number } {
  const now = Date.now();
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

export async function verifyAdmin(email: string, pass: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPass) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables!");
    return { success: false, error: 'خطأ في إعدادات النظام' };
  }

  // Rate limiting (use a generic key since we can't access IP easily in server actions)
  const rateLimitKey = email.toLowerCase().trim();
  const rateCheck = checkRateLimit(rateLimitKey);

  if (!rateCheck.allowed) {
    const minutesLeft = Math.ceil(rateCheck.lockoutMs / 60000);
    return { 
      success: false, 
      error: `تم تجاوز الحد الأقصى لمحاولات الدخول. يرجى المحاولة بعد ${minutesLeft} دقيقة.` 
    };
  }

  // Use timing-safe comparison to prevent timing attacks
  const emailMatch = email.length === adminEmail.length && 
    crypto.timingSafeEqual(Buffer.from(email), Buffer.from(adminEmail));
  const passMatch = pass.length === adminPass.length && 
    crypto.timingSafeEqual(Buffer.from(pass), Buffer.from(adminPass));

  if (emailMatch && passMatch) {
    // Clean up old sessions
    cleanExpiredSessions();

    // Generate a secure, unique session token
    const sessionToken = generateSessionToken();
    validSessions.set(sessionToken, { createdAt: Date.now() });

    // Set a secure, httpOnly cookie with the unique token
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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
  const token = cookieStore.get('admin_session')?.value;
  
  // Invalidate the session token
  if (token) {
    validSessions.delete(token);
  }
  
  cookieStore.delete('admin_session');
}

export async function checkAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  
  if (!token) return false;
  
  // Verify the token exists in valid sessions
  const session = validSessions.get(token);
  if (!session) return false;
  
  // Check if the session has expired (24 hours)
  const maxAge = 24 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > maxAge) {
    validSessions.delete(token);
    return false;
  }
  
  return true;
}

import fs from 'fs';
import path from 'path';

export async function getCvData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'cv.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function saveCvData(data: any) {
  // Security Check: Verify admin session
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بحفظ التغييرات.' };
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'cv.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
