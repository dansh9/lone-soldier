"use client";

import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import { listRequests } from "@/lib/api";
import { ApiResponse, EquipmentRequest } from "@/lib/types";
import { categoryLabel, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function SoldierDashboard() {
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [soldierId, setSoldierId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("soldier_id");
    setSoldierId(id);
    if (id) {
      loadRequests(id);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadRequests(id: string) {
    try {
      const res = (await listRequests({
        soldier_id: id,
      })) as ApiResponse<EquipmentRequest[]>;
      setRequests(res.data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  if (!soldierId) {
    return (
      <div className="text-center py-20 px-4">
        <div className="w-16 h-16 bg-olive-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-olive-500">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4 font-heebo">
          יש להירשם תחילה כדי לגשת ללוח הבקרה שלך.
        </p>
        <a href="/soldier/register" className="btn-olive py-2.5 px-8 text-sm">
          למסך ההרשמה
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-olive-500 font-heebo">
          הבקשות שלי
        </h1>
        <a href="/soldier/request/new" className="btn-olive py-2.5 px-6 text-sm">
          + בקשה חדשה
        </a>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-12">טוען...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4 font-heebo">
            עדיין לא הגשתם בקשות.
          </p>
          <a href="/soldier/request/new" className="text-olive-500 hover:text-olive-600 font-medium font-heebo">
            הגישו את הבקשה הראשונה שלכם &larr;
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-gray-900 font-heebo">
                    {req.item_name}
                  </span>
                  <StatusBadge status={req.status} />
                  <UrgencyBadge urgency={req.urgency} />
                </div>
                <p className="text-sm text-gray-500">
                  {categoryLabel(req.category)} &middot;{" "}
                  {formatDate(req.created_at)}
                </p>
                {req.description && (
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                    {req.description}
                  </p>
                )}
              </div>
              {req.status === "fulfilled" && (
                <span className="text-green-600 text-sm font-bold font-heebo bg-green-50 px-3 py-1 rounded-full">
                  הושלמה ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
