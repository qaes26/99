'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function StudentDashboard() {
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [housingArea, setHousingArea] = useState('');
    const [housingDetails, setHousingDetails] = useState('');

    const fetchStudent = () => {
        fetch('/api/student/me')
            .then(res => {
                if (res.status === 401) {
                    router.push('/');
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setStudent(data);
                    setHousingArea(data.housingArea);
                    setHousingDetails(data.housingDetails || '');
                }
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStudent();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/student/update-location', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ housingArea, housingDetails }),
        });
        if (res.ok) {
            setEditing(false);
            fetchStudent(); // Refresh to get new bus assignment
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>جاري التحميل...</div>;
    if (!student) return null;

    const bus = student.bus;
    const location = bus?.locations?.[0];

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header className="header">
                <div className="container header-content">
                    <div className="logo">نظام الباصات</div>
                    <button onClick={handleLogout} className="btn" style={{ border: '1px solid #e2e8f0' }}>تسجيل الخروج</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                    <div className="card">
                        <h2 style={{ marginBottom: '1rem' }}>ملف الطالب</h2>
                        {!editing ? (
                            <>
                                <div style={{ marginBottom: '0.5rem' }}><strong>الاسم:</strong> {student.name}</div>
                                <div style={{ marginBottom: '0.5rem' }}><strong>الرقم الجامعي:</strong> {student.studentId}</div>
                                <div style={{ marginBottom: '0.5rem' }}><strong>المنطقة:</strong> {student.housingArea}</div>
                                <div style={{ marginBottom: '0.5rem' }}><strong>التفاصيل:</strong> {student.housingDetails || '-'}</div>
                                <button onClick={() => setEditing(true)} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>تعديل السكن</button>
                            </>
                        ) : (
                            <form onSubmit={handleUpdate}>
                                <div className="input-group">
                                    <label>المنطقة</label>
                                    <select value={housingArea} onChange={(e) => setHousingArea(e.target.value)} required>
                                        <option value="North">الحي الشمالي</option>
                                        <option value="South">الحي الجنوبي</option>
                                        <option value="East">الحي الشرقي</option>
                                        <option value="West">الحي الغربي</option>
                                        <option value="Center">وسط البلد</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>التفاصيل</label>
                                    <input value={housingDetails} onChange={(e) => setHousingDetails(e.target.value)} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>حفظ</button>
                                    <button type="button" onClick={() => setEditing(false)} className="btn" style={{ flex: 1, border: '1px solid #e2e8f0' }}>إلغاء</button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="card">
                        <h2 style={{ marginBottom: '1rem' }}>معلومات الباص</h2>
                        {bus ? (
                            <>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                    {bus.busNumber}
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}><strong>السائق:</strong> {bus.driverName || 'غير محدد'}</div>
                                <div style={{ marginBottom: '0.5rem' }}><strong>خط السير:</strong> {bus.routeDescription}</div>
                                <div className="status-badge status-active">نشط الآن</div>
                            </>
                        ) : (
                            <p>لم يتم تعيين باص لك بعد. تأكد من منطقة السكن.</p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="card">
                        <h2 style={{ marginBottom: '1rem' }}>تتبع الباص</h2>
                        <div className="map-container">
                            <Map busLocation={location} />
                        </div>
                        {location ? (
                            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                آخر تحديث: {new Date(location.updatedAt).toLocaleTimeString()}
                            </p>
                        ) : (
                            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                لا يوجد بيانات موقع حالية.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
