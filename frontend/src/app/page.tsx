export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-olive-500 via-olive-600 to-olive-700 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white font-heebo leading-tight mb-6">
                מחברים חיילים בודדים
                <br />
                <span className="text-sky-300">עם ציוד לבית</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0 md:mr-0">
                מערכת חכמה שסורקת קבוצות תרומות ברחבי הרשת ומוצאת עבורכם
                רהיטים, מכשירי חשמל וציוד ביתי — בחינם.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/soldier/register" className="btn-olive bg-white !text-olive-600 hover:!bg-gray-100 text-lg py-3.5 px-10">
                  אני חייל/ת בודד/ה
                </a>
                <a href="/coordinator" className="btn-olive-outline !border-white !text-white hover:!bg-white/20 text-lg py-3.5 px-10">
                  כניסה לרכזים
                </a>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-white/10 rounded-3xl rotate-6" />
                <div className="absolute inset-0 bg-white/5 rounded-3xl -rotate-3" />
                <div className="relative bg-white/15 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center h-full border border-white/20">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <p className="text-white/90 text-xl font-heebo font-bold">מאתר ציוד</p>
                  <p className="text-white/60 text-sm">לחיילים בודדים</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading mb-12">איך זה עובד?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-olive-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-olive-500">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-olive-500 font-heebo mb-3">נרשמים</h3>
              <p className="text-gray-600 leading-relaxed">
                חיילים בודדים נרשמים למערכת ומספרים מה הם צריכים לדירה —
                רהיטים, מכשירי חשמל, כלי מטבח ועוד.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-sky-500 font-heebo mb-3">סורקים</h3>
              <p className="text-gray-600 leading-relaxed">
                סוכן AI חכם סורק קבוצות תרומות בפייסבוק, טלגרם, אגורה
                ועוד — ומוצא התאמות אוטומטית.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-olive-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-olive-500">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-olive-500 font-heebo mb-3">מתחברים</h3>
              <p className="text-gray-600 leading-relaxed">
                רכזי העמותה מאשרים את ההתאמה, והחייל מקבל הודעה
                עם פרטי התורם — פשוט וקל.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-sky-400 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-white font-heebo">500+</p>
              <p className="text-white/80 text-sm mt-1">חיילים נעזרו</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white font-heebo">1,200+</p>
              <p className="text-white/80 text-sm mt-1">פריטים הותאמו</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white font-heebo">24/7</p>
              <p className="text-white/80 text-sm mt-1">סריקה אוטומטית</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white font-heebo">6+</p>
              <p className="text-white/80 text-sm mt-1">מקורות תרומה</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading mb-4">מה אפשר לבקש?</h2>
          <p className="text-center text-gray-500 mb-12">כל מה שצריך כדי להפוך דירה ריקה לבית חם</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🛋️", name: "רהיטים", desc: "ספות, שולחנות, כיסאות" },
              { icon: "🔌", name: "מכשירי חשמל", desc: "מקרר, מכונת כביסה, מיקרוגל" },
              { icon: "🍳", name: "כלי מטבח", desc: "סירים, צלחות, סכו\"ם" },
              { icon: "🛏️", name: "מצעים", desc: "שמיכות, כריות, סדינים" },
              { icon: "💻", name: "אלקטרוניקה", desc: "טלוויזיה, מחשב, מסך" },
              { icon: "📦", name: "אחסון", desc: "ארונות, מדפים, קופסאות" },
              { icon: "💡", name: "תאורה", desc: "מנורות, נורות, אבזרי חשמל" },
              { icon: "🚿", name: "אמבטיה", desc: "מגבות, מדפים, אביזרים" },
            ].map((cat) => (
              <div key={cat.name} className="card p-5 text-center hover:border-olive-200 cursor-default">
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <p className="font-bold text-gray-800 font-heebo">{cat.name}</p>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-olive-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-olive-600 font-heebo mb-4">
            צריכים ציוד לדירה?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            הירשמו עכשיו ונמצא עבורכם ציוד מתרומות — בחינם ובלי מאמץ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/soldier/register" className="btn-olive text-lg py-3.5 px-12">
              הרשמה למערכת
            </a>
            <a
              href="https://achgadol.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sky text-lg py-3.5 px-12"
            >
              לתרומות אונליין
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
