"use client";

import { urgencyColor, urgencyLabel } from "@/lib/utils";

export default function UrgencyBadge({ urgency }: { urgency: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyColor(urgency)}`}
    >
      {urgencyLabel(urgency)}
    </span>
  );
}
