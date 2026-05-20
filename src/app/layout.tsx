import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "أعداد وبصيرة | AI Numerology",
  description: "حاسبة التوافق بالأرقام - دعي خوارزميات الذكاء الاصطناعي تحلل طاقة الأرقام القديمة",
  keywords: ["أعداد", "بصيرة", "توافق", "أرقام", "AI", "numerology"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta name="spaceremit-verification" content="3VAEBQG0VCI89LTFVLVAXRPBSMC3UAVF2EH0ABNQJHJHWV1C7G" />
      </head>
      <body>
        {children}
        {/* Spaceremit Payment Gateway Script */}
        <Script
          src="https://spaceremit.com/api/v2/js_script/spaceremit.js"
          strategy="afterInteractive"
        />
        {/* Tawk.to Live Chat Widget */}
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6a0e11de2370201c349f28e6/1jp3fbk93';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
