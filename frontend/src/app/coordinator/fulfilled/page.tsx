"use client";

import StatusBadge from "@/components/StatusBadge";
import { getFulfilledRequests } from "@/lib/api";
import { ApiResponse, EquipmentRequest } from "@/lib/types";
import { categoryLabel, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function FulfilledPage() {
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFulfilled();
  }, []);

  async function loadFulfilled() {
    try {
      const res = (await getFulfilledRequests()) as ApiResponse<
        EquipmentRequest[]
      >;
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
        בקשות שהושלמו
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center py-12">טוען...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-gray-600 font-heebo">אין בקשות שהושלמו עדיין.</p>
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
                  סטטוס
                </th>
                <th className="text-right px-4 py-3 font-bold text-olive-700 font-heebo">
                  נוצרה
                </th>
                <th className="text-right px-4 py-3 font-bold text-olive-700 font-heebo">
                  הושלמה
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-olive-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900 font-heebo">
                    {req.item_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {categoryLabel(req.category)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatDate(req.created_at)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {req.fulfilled_at ? formatDate(req.fulfilled_at) : "—"}
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
