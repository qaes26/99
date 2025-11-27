import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, loginUser } from '@/lib/auth';

export async function POST(request) {
    try {
        const { type, identifier, password } = await request.json(); // type: 'student' or 'admin'

        if (type === 'admin') {
            const admin = await prisma.admin.findUnique({ where: { username: identifier } });
            if (!admin || !(await comparePassword(password, admin.passwordHash))) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
            await loginUser({ id: admin.id, role: 'admin', name: admin.username });
            return NextResponse.json({ success: true, role: 'admin' });
        } else {
            // Student
            const student = await prisma.student.findUnique({ where: { studentId: identifier } });
            if (!student || !(await comparePassword(password, student.passwordHash))) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
            await loginUser({ id: student.id, role: 'student', name: student.name });
            return NextResponse.json({ success: true, role: 'student' });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
