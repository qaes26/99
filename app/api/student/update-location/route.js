import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

async function assignBus(housingArea) {
    const buses = await prisma.bus.findMany();
    const matchedBus = buses.find(b =>
        b.routeDescription && b.routeDescription.toLowerCase().includes(housingArea.toLowerCase())
    );
    return matchedBus ? matchedBus.id : (buses.length > 0 ? buses[0].id : null);
}

export async function PUT(request) {
    const session = await getSession();
    if (!session || session.role !== 'student') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { housingArea, housingDetails } = await request.json();
    const busId = await assignBus(housingArea);

    const updatedStudent = await prisma.student.update({
        where: { id: session.id },
        data: {
            housingArea,
            housingDetails,
            busId
        }
    });

    return NextResponse.json({ success: true, busId: updatedStudent.busId });
}
