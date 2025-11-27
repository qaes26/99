import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'student') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
        where: { id: session.id },
        include: {
            bus: {
                include: {
                    locations: {
                        orderBy: { updatedAt: 'desc' },
                        take: 1
                    }
                }
            }
        }
    });

    if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Remove password hash
    const { passwordHash, ...safeStudent } = student;
    return NextResponse.json(safeStudent);
}
