"use client";

import { getAnalytics } from "@/lib/api";
import { Analytics } from "@/lib/types";
import { categoryLabel, statusLabel } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const res = (await getAnalytics()) as { data: Analytics };
      setData(res.data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="text-gray-500 text-center py-12">טוען סטטיסטיקות...</p>;
  if (!data) return <p className="text-gray-500 text-center py-12">טעינת הסטטיסטיקות נכשלה.</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-olive-500 font-heebo mb-8">
        סטטיסטיקות
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <p className="text-sm text-gray-500 font-heebo mb-1">סה&quot;כ בקשות</p>
          <p className="text-3xl font-extrabold text-gray-900 font-heebo">
            {data.total_requests}
          </p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-sm text-gray-500 font-heebo mb-1">הושלמו</p>
          <p className="text-3xl font-extrabold text-green-600 font-heebo">
            {data.total_fulfilled}
          </p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-sm text-gray-500 font-heebo mb-1">אחוז התאמה</p>
          <p className="text-3xl font-extrabold text-olive-500 font-heebo">
            {data.match_rate_percent}%
          </p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-sm text-gray-500 font-heebo mb-1">זמן ממוצע להתאמה</p>
          <p className="text-3xl font-extrabold text-gray-900 font-heebo">
            {data.avg_time_to_match_hours
              ? `${data.avg_time_to_match_hours} שע'`
              : "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requests by status */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-olive-500 font-heebo mb-4">
            בקשות לפי סטטוס
          </h2>
          <div className="space-y-3">
            {Object.entries(data.requests_by_status).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-heebo">
                  {statusLabel(status)}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-olive-400 rounded-full transition-all"
                      style={{
                        width: `${Math.max(5, (count / data.total_requests) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-left font-heebo">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top unmet categories */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-olive-500 font-heebo mb-4">
            צרכים בולטים שלא מולאו
          </h2>
          {data.top_unmet_categories.length === 0 ? (
            <p className="text-sm text-gray-500 font-heebo">אין צרכים שלא מולאו</p>
          ) : (
            <div className="space-y-3">
              {data.top_unmet_categories.map((item) => (
                <div
                  key={item.category}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-600 font-heebo">
                    {categoryLabel(item.category)}
                  </span>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full font-heebo">
                    {item.count} פתוחות
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matches by status */}
        <div className="card p-5 md:col-span-2">
          <h2 className="text-lg font-bold text-olive-500 font-heebo mb-4">
            התאמות לפי סטטוס
          </h2>
          <div className="flex gap-8 flex-wrap">
            {Object.entries(data.matches_by_status).map(([status, count]) => (
              <div key={status} className="text-center">
                <p className="text-2xl font-extrabold text-gray-900 font-heebo">{count}</p>
                <p className="text-xs text-gray-500 font-heebo mt-1">
                  {statusLabel(status)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
