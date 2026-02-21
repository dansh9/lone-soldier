"use client";

import { createManualMatch, listRequests } from "@/lib/api";
import { ApiResponse, EquipmentRequest } from "@/lib/types";
import { categoryLabel, urgencyLabel } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManualMatchPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOpenRequests();
  }, []);

  async function loadOpenRequests() {
    try {
      const res = (await listRequests({ status: "open" })) as ApiResponse<
        EquipmentRequest[]
      >;
      setRequests(res.data);
    } catch {
      // handle error
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      request_id: form.get("request_id"),
      item_description: form.get("item_description") || null,
      donor_contact: form.get("donor_contact") || null,
      location: form.get("location") || null,
    };

    try {
      await createManualMatch(data);
      router.push("/coordinator");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "יצירת ההתאמה נכשלה"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-extrabold text-olive-500 font-heebo mb-6">
        יצירת התאמה ידנית
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="input-label">בחר בקשה *</label>
          <select name="request_id" required className="input-field">
            <option value="">בחרו בקשה...</option>
            {requests.map((req) => (
              <option key={req.id} value={req.id}>
                {req.item_name} ({categoryLabel(req.category)}) — {urgencyLabel(req.urgency)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label">תיאור הפריט *</label>
          <textarea
            name="item_description"
            required
            rows={3}
            className="input-field"
            placeholder="תארו את הפריט התרום..."
          />
        </div>

        <div>
          <label className="input-label">פרטי התורם</label>
          <input
            name="donor_contact"
            className="input-field"
            placeholder="טלפון או שם"
          />
        </div>

        <div>
          <label className="input-label">מיקום</label>
          <input
            name="location"
            className="input-field"
            placeholder="עיר או שכונה"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-olive w-full py-3.5 text-base disabled:opacity-50"
        >
          {loading ? "יוצר..." : "צור התאמה"}
        </button>
      </form>
    </div>
  );
}
