import './globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata = {
  title: 'University Bus System',
  description: 'Real-time bus tracking for university students.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <footer className="footer">
            <div className="container">
              <p>University Bus System &copy; {new Date().getFullYear()}</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                إعداد الطالب: قيس طلال الجازي
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
