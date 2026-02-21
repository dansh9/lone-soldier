const NAV_ITEMS = [
  { href: "/coordinator", label: "התאמות חדשות", icon: "🔔" },
  { href: "/coordinator/requests", label: "בקשות פתוחות", icon: "📋" },
  { href: "/coordinator/matches", label: "כל ההתאמות", icon: "🔗" },
  { href: "/coordinator/fulfilled", label: "הושלמו", icon: "✅" },
  { href: "/coordinator/analytics", label: "סטטיסטיקות", icon: "📊" },
  { href: "/coordinator/manual-match", label: "התאמה ידנית", icon: "✏️" },
];

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="w-52 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs text-gray-400 font-heebo font-bold uppercase tracking-wider mb-3 px-3">
              לוח בקרה
            </p>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl text-gray-700 hover:bg-olive-50 hover:text-olive-600 transition-colors font-heebo"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
