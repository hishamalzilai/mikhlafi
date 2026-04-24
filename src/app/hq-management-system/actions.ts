"use server";

import { cookies } from 'next/headers';

export async function verifyAdmin(email: string, pass: string) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPass) {
        console.error("ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables!");
        return { success: false, error: 'خطأ في إعدادات النظام' };
    }
    
    if (email === adminEmail && pass === adminPass) {
        // Set a secure, httpOnly cookie for 24 hours
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });
        return { success: true };
    }
    
    return { success: false, error: 'بيانات غير صحيحة' };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}

export async function checkAdminSession() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_session')?.value === 'true';
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
