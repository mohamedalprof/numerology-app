# 🚀 دليل نشر موقع أعداد وبصيرة على Vercel

## الخطوة 1: إنشاء حساب GitHub
1. اذهبي إلى https://github.com/signup
2. أنشئي حساباً مجانياً
3. تأكدي البريد الإلكتروني

## الخطوة 2: رفع المشروع على GitHub
1. أنشئي مستودع جديد (New Repository) باسم: `numerology-app`
2. لا تختاري Initialize with README
3. من جهازك، افتحي Terminal وشغّلي:
```bash
cd /home/z/my-project
git remote add origin https://github.com/USERNAME/numerology-app.git
git push -u origin main
```

## الخطوة 3: النشر على Vercel (مجاني)
1. اذهبي إلى https://vercel.com/signup
2. سجلي بالحساب GitHub الذي أنشأتِه
3. اضغطي "Add New" → "Project"
4. اختاري مستودع `numerology-app`
5. في قسم "Environment Variables" أضيفي:

| المتغير | القيمة |
|---------|--------|
| SPACEREMIT_PUBLIC_KEY | pkO7UH3TAESAQEOARU9E86IZF8TFQ1Q3VZOB05226Z05YRV23MOO |
| SPACEREMIT_SECRET_KEY | skJAZMJDRAR0PEI8Z7HCY9OHMYYELKGOBKVSH6PZDJEL1W369QKP |
| SPACEREMIT_AMOUNT | 5 |
| SPACEREMIT_CURRENCY | USD |
| NEXT_PUBLIC_SPACEREMIT_PUBLIC_KEY | pkO7UH3TAESAQEOARU9E86IZF8TFQ1Q3VZOB05226Z05YRV23MOO |
| NEXT_PUBLIC_SPACEREMIT_AMOUNT | 5 |
| NEXT_PUBLIC_SPACEREMIT_CURRENCY | USD |

6. اضغطي "Deploy"
7. انتظري 2-3 دقائق ⏳
8. ستحصلين على رابط مثل: `https://numerology-app.vercel.app`

## الخطوة 4: تسجيل الدومين في Spaceremit
بعد الحصول على رابط Vercel:
1. سجلي دخول في spaceremit.com
2. في إعدادات المتجر، أضيفي:
   - Domain: `numerology-app.vercel.app`
   - Callback URL: `https://numerology-app.vercel.app/api/spaceremit-callback`

## 💡 ملاحظات مهمة
- Vercel مجاني 100% لمثل هذا المشروع
- الموقع سيعمل 24/7 بدون توقف
- كل مرة تعدلين الكود وتعملين push على GitHub، Vercel يعيد النشر تلقائياً
- يمكنك ربط دومين خاص (مثل adad-wabaseera.com) من إعدادات Vercel
