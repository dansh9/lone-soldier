"use client";

import { Match } from "@/lib/types";
import { formatDate, platformLabel } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface MatchCardProps {
  match: Match;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function MatchCard({ match, onApprove, onReject }: MatchCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={match.status} />
          <span className="text-sm text-gray-500 font-heebo">
            ציון: {(match.score * 100).toFixed(0)}%
          </span>
          {match.distance_km && (
            <span className="text-sm text-gray-500">
              {match.distance_km.toFixed(1)} ק&quot;מ
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(match.created_at)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Request side */}
        <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
          <p className="text-xs text-sky-600 font-bold font-heebo mb-2">בקשה</p>
          {match.request && (
            <>
              <p className="font-bold text-gray-900 font-heebo">
                {match.request.item_name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {match.request.category} &middot; {match.request.urgency}
              </p>
              {match.request.description && (
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {match.request.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Post side */}
        <div className="bg-olive-50 rounded-xl p-4 border border-olive-100">
          <p className="text-xs text-olive-600 font-bold font-heebo mb-2">תרומה</p>
          {match.post && (
            <>
              <p className="font-bold text-gray-900 font-heebo">
                {match.post.extracted_item || "פריט תרומה"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {platformLabel(match.post.source_platform)} &middot;{" "}
                {match.post.extracted_condition || "מצב לא ידוע"}
              </p>
              {match.post.location_text && (
                <p className="text-sm text-gray-500 mt-2">
                  📍 {match.post.location_text}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {(onApprove || onReject) && match.status === "pending_review" && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          {onApprove && (
            <button
              onClick={() => onApprove(match.id)}
              className="btn-olive py-2 px-6 text-sm"
            >
              אישור
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(match.id)}
              className="px-6 py-2 bg-red-50 text-red-600 text-sm rounded-pill font-medium hover:bg-red-100 transition-colors border border-red-200"
            >
              דחייה
            </button>
          )}
        </div>
      )}
    </div>
  );
}
