'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBus, setNewBus] = useState({ busNumber: '', driverName: '', routeDescription: '', capacity: '' });

    const fetchBuses = () => {
        fetch('/api/admin/buses')
            .then(res => {
                if (res.status === 401) {
                    router.push('/');
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) setBuses(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBuses();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    const handleAddBus = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/admin/buses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBus),
        });
        if (res.ok) {
            setNewBus({ busNumber: '', driverName: '', routeDescription: '', capacity: '' });
            fetchBuses();
        }
    };

    const updateLocation = async (busId) => {
        const baseLat = 31.9539;
        const baseLng = 35.9106;
        const lat = baseLat + (Math.random() - 0.5) * 0.05;
        const lng = baseLng + (Math.random() - 0.5) * 0.05;

        await fetch('/api/bus/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ busId, latitude: lat, longitude: lng }),
        });
        fetchBuses();
        alert('تم تحديث موقع الباص بنجاح');
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>جاري التحميل...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header className="header">
                <div className="container header-content">
                    <div className="logo">لوحة تحكم المسؤول</div>
                    <button onClick={handleLogout} className="btn" style={{ border: '1px solid #e2e8f0' }}>تسجيل الخروج</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                    <div className="card">
                        <h2 style={{ marginBottom: '1rem' }}>إضافة باص جديد</h2>
                        <form onSubmit={handleAddBus}>
                            <div className="input-group">
                                <label>رقم الباص</label>
                                <input value={newBus.busNumber} onChange={e => setNewBus({ ...newBus, busNumber: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>اسم السائق</label>
                                <input value={newBus.driverName} onChange={e => setNewBus({ ...newBus, driverName: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>خط السير (الأحياء)</label>
                                <input value={newBus.routeDescription} onChange={e => setNewBus({ ...newBus, routeDescription: e.target.value })} placeholder="مثال: الحي الشمالي، وسط البلد" />
                            </div>
                            <div className="input-group">
                                <label>السعة</label>
                                <input type="number" value={newBus.capacity} onChange={e => setNewBus({ ...newBus, capacity: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>إضافة</button>
                        </form>
                    </div>
                </div>

                <div>
                    <div className="card">
                        <h2 style={{ marginBottom: '1rem' }}>قائمة الباصات</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>
                                        <th style={{ padding: '0.75rem' }}>الرقم</th>
                                        <th style={{ padding: '0.75rem' }}>السائق</th>
                                        <th style={{ padding: '0.75rem' }}>خط السير</th>
                                        <th style={{ padding: '0.75rem' }}>الطلاب</th>
                                        <th style={{ padding: '0.75rem' }}>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buses.map(bus => (
                                        <tr key={bus.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '0.75rem' }}>{bus.busNumber}</td>
                                            <td style={{ padding: '0.75rem' }}>{bus.driverName}</td>
                                            <td style={{ padding: '0.75rem' }}>{bus.routeDescription}</td>
                                            <td style={{ padding: '0.75rem' }}>{bus._count.students}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <button
                                                    onClick={() => updateLocation(bus.id)}
                                                    className="btn"
                                                    style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534' }}
                                                >
                                                    تحديث الموقع
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
