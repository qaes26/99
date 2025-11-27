import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, loginUser } from '@/lib/auth';

async function assignBus(housingArea) {
    // Simple logic: Find a bus that covers this area in its route description
    // If not found, assign to a default bus or the first one.
    const buses = await prisma.bus.findMany();

    // Try to find a match
    const matchedBus = buses.find(b =>
        b.routeDescription && b.routeDescription.toLowerCase().includes(housingArea.toLowerCase())
    );

    if (matchedBus) return matchedBus.id;

    // Fallback: Assign to the first bus available or null
    return buses.length > 0 ? buses[0].id : null;
}

export async function POST(request) {
    try {
        const { studentId, name, email, password, housingArea, housingDetails } = await request.json();

        const existing = await prisma.student.findUnique({ where: { studentId } });
        if (existing) {
            return NextResponse.json({ error: 'Student ID already exists' }, { status: 400 });
        }

        const passwordHash = await hashPassword(password);
        const busId = await assignBus(housingArea);

        const student = await prisma.student.create({
            data: {
                studentId,
                name,
                email,
                passwordHash,
                housingArea,
                housingDetails,
                busId
            }
        });

        await loginUser({ id: student.id, role: 'student', name: student.name });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
