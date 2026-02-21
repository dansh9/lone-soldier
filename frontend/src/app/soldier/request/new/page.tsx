"use client";

import { createRequest } from "@/lib/api";
import { categoryLabel } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CATEGORIES = [
  "furniture",
  "appliance",
  "kitchenware",
  "bedding",
  "electronics",
  "storage",
  "lighting",
  "bathroom",
  "other",
];

export default function NewRequestPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [soldierId, setSoldierId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("soldier_id");
    setSoldierId(id);
  }, []);

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
        <p className="text-gray-600 mb-4 font-heebo">יש להירשם תחילה.</p>
        <a href="/soldier/register" className="btn-olive py-2.5 px-8 text-sm">
          למסך ההרשמה
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      soldier_id: soldierId,
      category: form.get("category"),
      item_name: form.get("item_name"),
      description: form.get("description") || null,
      urgency: form.get("urgency") || "medium",
      dimensions: form.get("dimensions") || null,
    };

    try {
      await createRequest(data);
      router.push("/soldier/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "שליחת הבקשה נכשלה"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-olive-500 font-heebo mb-2">
          בקשת ציוד חדשה
        </h1>
        <p className="text-gray-500">ספרו לנו מה אתם צריכים ואנחנו נחפש עבורכם</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="input-label">קטגוריה *</label>
          <select name="category" required className="input-field">
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabel(cat)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label">שם הפריט *</label>
          <input
            name="item_name"
            required
            className="input-field"
            placeholder="לדוגמה: שולחן כתיבה, מכונת כביסה, מיטה"
          />
        </div>

        <div>
          <label className="input-label">תיאור</label>
          <textarea
            name="description"
            rows={3}
            className="input-field"
            placeholder="צרכים או העדפות מיוחדים..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">דחיפות</label>
            <select name="urgency" defaultValue="medium" className="input-field">
              <option value="low">נמוכה</option>
              <option value="medium">בינונית</option>
              <option value="high">גבוהה</option>
              <option value="critical">דחופה</option>
            </select>
          </div>
          <div>
            <label className="input-label">מידות מקסימליות</label>
            <input
              name="dimensions"
              className="input-field"
              placeholder="לדוגמה: 120x60 ס״מ"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-olive w-full py-3.5 text-base disabled:opacity-50"
        >
          {loading ? "שולח..." : "שלח בקשה"}
        </button>
      </form>
    </div>
  );
}
