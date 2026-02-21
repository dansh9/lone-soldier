"use client";

import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import { getOpenRequests } from "@/lib/api";
import { ApiResponse, EquipmentRequest } from "@/lib/types";
import { ageColor, categoryLabel, formatAge, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function OpenRequestsPage() {
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const res = (await getOpenRequests()) as ApiResponse<EquipmentRequest[]>;
      setRequests(res.data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-olive-500 font-heebo mb-6">
        בקשות פתוחות
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center py-12">טוען...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-gray-600 font-heebo">אין בקשות פתוחות כרגע.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-olive-50 border-b border-olive-100">
              <tr>
                <th className="text-right px-4 py-3 font-bold text-olive-700 font-heebo">
                  פריט
                </th>
                <th className="text-right px-4 py-3 font-bold text-olive-700 font-heebo">
                  קטגוריה
                </th>
                <th className="text-right px-4 py-3 font-bold text-olive-700 font-heebo">
                  דחיפות
                </th>
                <th className="text-right px-4 py-3 font-bold text-olive-700 font-heebo">
                  גיל
                </th>
                <th className="text-right px-4 py-3 font-bold text-olive-700 font-heebo">
                  סטטוס
                </th>
                <th className="text-right px-4 py-3 font-bold text-olive-700 font-heebo">
                  תאריך
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-olive-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-gray-900 font-heebo">
                      {req.item_name}
                    </span>
                    {req.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {req.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {categoryLabel(req.category)}
                  </td>
                  <td className="px-4 py-3">
                    <UrgencyBadge urgency={req.urgency} />
                  </td>
                  <td className="px-4 py-3">
                    {req.age_hours !== undefined && req.age_level && (
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${ageColor(req.age_level)}`}
                      >
                        {formatAge(req.age_hours)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatDate(req.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
