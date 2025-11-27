import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request) {
    // Update location
    const session = await getSession();
    // Allow admin to update any bus. 
    // In a real app, drivers would have their own auth.
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { busId, latitude, longitude } = await request.json();

    const location = await prisma.busLocation.create({
        data: {
            busId: parseInt(busId),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
    });

    return NextResponse.json(location);
}
