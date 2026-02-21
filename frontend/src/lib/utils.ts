export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAge(hours: number): string {
  if (hours < 1) return "פחות משעה";
  if (hours < 24) return `${Math.round(hours)} שע'`;
  const days = Math.floor(hours / 24);
  return `${days} ימים`;
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    furniture: "רהיטים",
    appliance: "מכשירי חשמל",
    kitchenware: "כלי מטבח",
    bedding: "מצעים",
    electronics: "אלקטרוניקה",
    storage: "אחסון",
    lighting: "תאורה",
    bathroom: "אמבטיה",
    other: "אחר",
  };
  return labels[category] || category;
}

export function urgencyLabel(urgency: string): string {
  const labels: Record<string, string> = {
    low: "נמוכה",
    medium: "בינונית",
    high: "גבוהה",
    critical: "דחופה",
  };
  return labels[urgency] || urgency;
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: "פתוחה",
    match_found: "נמצאה התאמה",
    pending_acceptance: "ממתין לאישור",
    fulfilled: "הושלמה",
    expired: "פג תוקף",
    pending_review: "ממתין לבדיקה",
    coordinator_approved: "אושר ע\"י רכז",
    soldier_notified: "החייל עודכן",
    accepted: "התקבל",
    rejected: "נדחה",
  };
  return labels[status] || status.replace(/_/g, " ");
}

export function urgencyColor(urgency: string): string {
  const colors: Record<string, string> = {
    low: "bg-olive-100 text-olive-700",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return colors[urgency] || "bg-gray-100 text-gray-800";
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    open: "bg-sky-100 text-sky-700",
    match_found: "bg-olive-100 text-olive-700",
    pending_acceptance: "bg-yellow-100 text-yellow-800",
    fulfilled: "bg-green-100 text-green-800",
    expired: "bg-gray-100 text-gray-600",
    pending_review: "bg-sky-100 text-sky-700",
    coordinator_approved: "bg-olive-100 text-olive-700",
    soldier_notified: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function ageColor(level: string): string {
  const colors: Record<string, string> = {
    fresh: "bg-olive-100 text-olive-700",
    aging: "bg-yellow-100 text-yellow-800",
    old: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return colors[level] || "bg-gray-100 text-gray-800";
}

export function platformLabel(platform: string): string {
  const labels: Record<string, string> = {
    agora: "אגורה",
    telegram: "טלגרם",
    facebook: "פייסבוק",
    whatsapp: "וואטסאפ",
    yad2: "יד2",
    manual: "ידני",
  };
  return labels[platform] || platform;
}
