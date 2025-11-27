const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash: adminPassword,
            role: 'admin'
        }
    });

    // Create Buses
    const bus1 = await prisma.bus.upsert({
        where: { busNumber: 'BUS-001' },
        update: {},
        create: {
            busNumber: 'BUS-001',
            driverName: 'أحمد محمد',
            routeDescription: 'الحي الشمالي - الجامعة',
            capacity: 50
        }
    });

    const bus2 = await prisma.bus.upsert({
        where: { busNumber: 'BUS-002' },
        update: {},
        create: {
            busNumber: 'BUS-002',
            driverName: 'خالد علي',
            routeDescription: 'الحي الجنوبي - الجامعة',
            capacity: 50
        }
    });

    const bus3 = await prisma.bus.upsert({
        where: { busNumber: 'BUS-003' },
        update: {},
        create: {
            busNumber: 'BUS-003',
            driverName: 'سعيد حسن',
            routeDescription: 'وسط البلد - الجامعة',
            capacity: 50
        }
    });

    // Create Bus Locations
    await prisma.busLocation.create({
        data: {
            busId: bus1.id,
            latitude: 31.96,
            longitude: 35.92
        }
    });

    // Create Student
    const studentPassword = await bcrypt.hash('student123', 10);
    await prisma.student.upsert({
        where: { studentId: '20230001' },
        update: {},
        create: {
            studentId: '20230001',
            name: 'قيس طلال الجازي',
            email: 'qais@uni.edu.jo',
            passwordHash: studentPassword,
            housingArea: 'North',
            housingDetails: 'قرب الدوار',
            busId: bus1.id
        }
    });

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
