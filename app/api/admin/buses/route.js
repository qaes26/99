import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    // Allow students to see buses too? Maybe just admin. 
    // For now, let's allow authenticated users to see basic list, but full details for admin.
    // Actually, let's restrict to admin for management.

    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const buses = await prisma.bus.findMany({
        include: {
            _count: {
                select: { students: true }
            },
            locations: {
                orderBy: { updatedAt: 'desc' },
                take: 1
            }
        }
    });
    return NextResponse.json(buses);
}

export async function POST(request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const bus = await prisma.bus.create({
        data: {
            busNumber: data.busNumber,
            driverName: data.driverName,
            routeDescription: data.routeDescription,
            capacity: parseInt(data.capacity) || 0
        }
    });
    return NextResponse.json(bus);
}
