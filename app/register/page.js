'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        housingArea: '',
        housingDetails: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/student/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>إنشاء حساب طالب جديد</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                    <div className="input-group">
                        <label>الاسم الكامل</label>
                        <input name="name" type="text" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>الرقم الجامعي</label>
                        <input name="studentId" type="text" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>البريد الإلكتروني (اختياري)</label>
                        <input name="email" type="email" onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label>كلمة المرور</label>
                        <input name="password" type="password" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>تأكيد كلمة المرور</label>
                        <input name="confirmPassword" type="password" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>منطقة السكن</label>
                        <select name="housingArea" onChange={handleChange} required defaultValue="">
                            <option value="" disabled>اختر المنطقة</option>
                            <option value="North">الحي الشمالي</option>
                            <option value="South">الحي الجنوبي</option>
                            <option value="East">الحي الشرقي</option>
                            <option value="West">الحي الغربي</option>
                            <option value="Center">وسط البلد</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>تفاصيل السكن (اختياري)</label>
                        <input name="housingDetails" type="text" placeholder="مثال: بجانب المسجد الكبير" onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-light)' }}>لديك حساب بالفعل؟ <Link href="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>تسجيل الدخول</Link></p>
                </div>
            </div>
        </div>
    );
}
