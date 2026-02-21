"use client";

import { createSoldier } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email") || null,
      idf_unit: form.get("idf_unit") || null,
      idf_base: form.get("idf_base") || null,
      apartment_address: form.get("apartment_address"),
      language: form.get("language") || "he",
      contact_method: form.get("contact_method") || "whatsapp",
    };

    try {
      const res = (await createSoldier(data)) as { data: { id: string } };
      localStorage.setItem("soldier_id", res.data.id);
      router.push("/soldier/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "ההרשמה נכשלה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-olive-500 font-heebo mb-2">
          הרשמה למערכת
        </h1>
        <p className="text-gray-500">מלאו את הפרטים ונתחיל לחפש עבורכם ציוד</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="input-label">שם מלא *</label>
          <input
            name="name"
            required
            className="input-field"
            placeholder="השם המלא שלך"
          />
        </div>

        <div>
          <label className="input-label">מספר טלפון *</label>
          <input
            name="phone"
            required
            type="tel"
            className="input-field"
            placeholder="05X-XXXXXXX"
          />
        </div>

        <div>
          <label className="input-label">אימייל</label>
          <input
            name="email"
            type="email"
            className="input-field"
            placeholder="your@email.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">יחידה צבאית</label>
            <input
              name="idf_unit"
              className="input-field"
              placeholder="לדוגמה: גולני"
            />
          </div>
          <div>
            <label className="input-label">בסיס</label>
            <input
              name="idf_base"
              className="input-field"
              placeholder="לדוגמה: מחנה צריפין"
            />
          </div>
        </div>

        <div>
          <label className="input-label">כתובת דירה *</label>
          <input
            name="apartment_address"
            required
            className="input-field"
            placeholder="כתובת מלאה כולל עיר"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">שפה</label>
            <select name="language" className="input-field">
              <option value="he">עברית</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="input-label">אמצעי קשר</label>
            <select name="contact_method" className="input-field">
              <option value="whatsapp">וואטסאפ</option>
              <option value="sms">SMS</option>
              <option value="email">אימייל</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-olive w-full py-3.5 text-base disabled:opacity-50"
        >
          {loading ? "נרשם..." : "הרשמה"}
        </button>
      </form>
    </div>
  );
}
