# University Bus System (نظام باصات الجامعة)

**إعداد الطالب: قيس طلال الجازي**

## نظرة عامة
هذا المشروع عبارة عن نظام متكامل لإدارة وتتبع باصات الجامعة، تم بناؤه باستخدام **Next.js** ليعمل كتطبيق Full-Stack (Frontend + Backend)، مع قاعدة بيانات **PostgreSQL** وإدارة البيانات عبر **Prisma ORM**.

## المميزات
- **للطلاب**:
  - تسجيل الدخول برقم الطالب.
  - تحديد مكان السكن ليتم ربط الطالب بالباص المناسب تلقائيًا.
  - عرض معلومات الباص المخصص (رقم الباص، السائق، خط السير).
  - تتبع موقع الباص الحالي على الخريطة (Real-time).
- **للإدارة (Admin)**:
  - لوحة تحكم لإضافة وإدارة الباصات.
  - تحديث مواقع الباصات (محاكاة لنظام GPS).
  - مشاهدة عدد الطلاب في كل باص.

## التقنيات المستخدمة
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Maps**: Leaflet (React-Leaflet)
- **Styling**: CSS Modules / Global CSS (Premium Design)
- **Deployment**: Vercel

---

## تعليمات التشغيل محليًا (Local Development)

### 1. تثبيت المتطلبات
تأكد من تثبيت Node.js. ثم قم بتشغيل الأمر التالي في مجلد المشروع:
```bash
npm install
```

### 2. إعداد قاعدة البيانات
قم بإنشاء ملف `.env` في جذر المشروع وأضف رابط قاعدة البيانات. يمكنك استخدام PostgreSQL محلي أو سحابي (مثل Supabase/Neon).
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-super-secret-key"
```

ثم قم بتشغيل الأوامر التالية لإنشاء الجداول وملء البيانات التجريبية:
```bash
# إنشاء الجداول
npx prisma migrate dev --name init

# إضافة بيانات تجريبية (Seed)
node prisma/seed.js
```

### 3. تشغيل التطبيق
```bash
npm run dev
```
افتح المتصفح على الرابط: `http://localhost:3000`

**بيانات الدخول التجريبية:**
- **طالب**:
  - الرقم الجامعي: `20230001`
  - كلمة المرور: `student123`
- **أدمن**:
  - اسم المستخدم: `admin`
  - كلمة المرور: `admin123`

---

## تعليمات النشر على Vercel

1. ارفع المشروع على حسابك في **GitHub**.
2. اذهب إلى موقع [Vercel](https://vercel.com) وقم بتسجيل الدخول.
3. اضغط على **"Add New Project"** واختر المستودع (Repository) الخاص بالمشروع.
4. في صفحة الإعدادات (Configure Project):
   - **Framework Preset**: اختر Next.js.
   - **Environment Variables**: أضف المتغيرات التالية:
     - `DATABASE_URL`: رابط قاعدة بيانات PostgreSQL (يمكنك الحصول عليه مجانًا من Supabase أو Neon).
     - `JWT_SECRET`: مفتاح سري عشوائي لتشفير الجلسات.
5. اضغط **Deploy**.
6. بعد الانتهاء، سيتم تزويدك برابط للتطبيق يعمل مباشرة.

---

## المخطط المعماري (Architecture)

- **Frontend**: واجهات React مبنية داخل Next.js App Router. تتواصل مع الـ API Routes لجلب البيانات.
- **Backend**: API Routes موجودة في مجلد `app/api`. تقوم بمعالجة الطلبات والاتصال بقاعدة البيانات.
- **Database**: PostgreSQL تحتوي على جداول (Students, Buses, BusLocations, Admins).
- **Authentication**: نظام JWT مخزن في Cookies (HttpOnly) لضمان الأمان.

## مخطط قاعدة البيانات (ERD)

- **Students**: بيانات الطلاب، مرتبط بجدول Buses (Many-to-One).
- **Buses**: بيانات الباصات.
- **BusLocations**: سجلات مواقع الباصات، مرتبط بجدول Buses (One-to-Many).
- **Admins**: حسابات المسؤولين.

---

**إعداد الطالب: قيس طلال الجازي**
