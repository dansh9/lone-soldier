"use client";

import MatchCard from "@/components/MatchCard";
import { listMatches, updateMatch } from "@/lib/api";
import { ApiResponse, Match, MatchStatus } from "@/lib/types";
import { useEffect, useState } from "react";

const STATUS_FILTERS: { label: string; value: MatchStatus | "" }[] = [
  { label: "הכל", value: "" },
  { label: "ממתין לבדיקה", value: "pending_review" },
  { label: "אושר", value: "coordinator_approved" },
  { label: "התקבל", value: "accepted" },
  { label: "נדחה", value: "rejected" },
];

export default function AllMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    loadMatches();
  }, [statusFilter]);

  async function loadMatches() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const res = (await listMatches(params)) as ApiResponse<Match[]>;
      setMatches(res.data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    await updateMatch(id, { status: "coordinator_approved" });
    loadMatches();
  }

  async function handleReject(id: string) {
    await updateMatch(id, { status: "rejected" });
    loadMatches();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-olive-500 font-heebo mb-6">
        כל ההתאמות
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 text-sm rounded-pill border transition-all font-heebo ${
              statusFilter === f.value
                ? "bg-olive-500 text-white border-olive-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:bg-olive-50 hover:border-olive-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-12">טוען...</p>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-gray-600 font-heebo">לא נמצאו התאמות.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onApprove={
                match.status === "pending_review" ? handleApprove : undefined
              }
              onReject={
                match.status === "pending_review" ? handleReject : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
