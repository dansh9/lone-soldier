import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מאתר ציוד לחיילים בודדים | אח גדול",
  description:
    "מחברים חיילים בודדים עם ציוד ביתי תרום - רהיטים, מכשירי חשמל ועוד",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-white font-opensans">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-sky-400 to-olive-500 rounded-xl flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-olive-500 font-heebo leading-tight">
                  מאתר ציוד
                </p>
                <p className="text-[11px] text-gray-400 leading-tight">
                  לחיילים בודדים | אח גדול
                </p>
              </div>
            </a>

            <a
              href="https://achgadol.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-olive text-sm py-2 px-6"
            >
              תרומות אונליין
            </a>
          </div>

          <nav className="border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-8">
              <a href="/soldier/register" className="text-sm font-medium text-gray-600 hover:text-olive-500 transition-colors font-heebo">
                הרשמה
              </a>
              <a href="/soldier/dashboard" className="text-sm font-medium text-gray-600 hover:text-olive-500 transition-colors font-heebo">
                הבקשות שלי
              </a>
              <a href="/soldier/request/new" className="text-sm font-medium text-gray-600 hover:text-olive-500 transition-colors font-heebo">
                בקשה חדשה
              </a>
              <span className="w-px h-4 bg-gray-200" />
              <a href="/coordinator" className="text-sm font-medium text-gray-600 hover:text-olive-500 transition-colors font-heebo">
                לוח בקרה
              </a>
              <a href="/coordinator/analytics" className="text-sm font-medium text-gray-600 hover:text-olive-500 transition-colors font-heebo">
                סטטיסטיקות
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div>
                <h3 className="text-lg font-bold text-olive-500 font-heebo mb-3">
                  צור קשר
                </h3>
                <p className="text-sm text-gray-600">עמותת אח גדול למען חיילים בודדים</p>
                <p className="text-sm text-gray-400 mt-1">Big Brother Organization for Lone Soldiers</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-olive-500 font-heebo mb-3">ניווט</h3>
                <div className="space-y-2">
                  <a href="/soldier/register" className="block text-sm text-gray-600 hover:text-olive-500">הרשמת חייל</a>
                  <a href="/soldier/request/new" className="block text-sm text-gray-600 hover:text-olive-500">בקשת ציוד</a>
                  <a href="/coordinator" className="block text-sm text-gray-600 hover:text-olive-500">לוח בקרה</a>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-olive-500 rounded-xl flex items-center justify-center mb-3">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="flex gap-3">
                  <a href="https://achgadol.org" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-olive-500 hover:text-white transition-colors">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 mt-8 pt-6 text-center">
              <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} כל הזכויות שמורות | מאתר ציוד לחיילים בודדים
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
