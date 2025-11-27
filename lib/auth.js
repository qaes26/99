import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function loginUser(payload) {
    const token = signToken(payload);
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
    return token;
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
}
