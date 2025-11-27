'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isStudent, setIsStudent] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: isStudent ? 'student' : 'admin',
          identifier,
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>نظام باصات الجامعة</h1>
          <p style={{ color: 'var(--text-light)' }}>تسجيل الدخول</p>
        </div>

        <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setIsStudent(true)}
            style={{
              flex: 1,
              padding: '1rem',
              background: 'none',
              border: 'none',
              borderBottom: isStudent ? '2px solid var(--primary)' : 'none',
              color: isStudent ? 'var(--primary)' : 'var(--text-light)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            طالب
          </button>
          <button
            onClick={() => setIsStudent(false)}
            style={{
              flex: 1,
              padding: '1rem',
              background: 'none',
              border: 'none',
              borderBottom: !isStudent ? '2px solid var(--primary)' : 'none',
              color: !isStudent ? 'var(--primary)' : 'var(--text-light)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            مسؤول (Admin)
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <div className="input-group">
            <label>{isStudent ? 'الرقم الجامعي' : 'اسم المستخدم'}</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {isStudent && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)' }}>ليس لديك حساب؟ <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>إنشاء حساب جديد</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
