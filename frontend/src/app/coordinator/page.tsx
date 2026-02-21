"use client";

import MatchCard from "@/components/MatchCard";
import { getCoordinatorFeed, updateMatch } from "@/lib/api";
import { ApiResponse, Match } from "@/lib/types";
import { useEffect, useState } from "react";

export default function CoordinatorDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      const res = (await getCoordinatorFeed()) as ApiResponse<Match[]>;
      setMatches(res.data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      await updateMatch(id, { status: "coordinator_approved" });
      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // handle error
    }
  }

  async function handleReject(id: string) {
    try {
      await updateMatch(id, { status: "rejected" });
      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // handle error
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-olive-500 font-heebo mb-6">
        התאמות חדשות — ממתין לבדיקה
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center py-12">טוען...</p>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-gray-600 font-heebo">
            אין התאמות הממתינות לבדיקה. סוכן ה-AI ימצא התאמות חדשות אוטומטית.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
