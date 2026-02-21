const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || error.error?.message || "API error");
  }

  return res.json();
}

// Soldiers
export const createSoldier = (data: Record<string, unknown>) =>
  fetchApi("/api/soldiers", { method: "POST", body: JSON.stringify(data) });

export const getSoldier = (id: string) =>
  fetchApi(`/api/soldiers/${id}`);

export const updateSoldier = (id: string, data: Record<string, unknown>) =>
  fetchApi(`/api/soldiers/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// Requests
export const createRequest = (data: Record<string, unknown>) =>
  fetchApi("/api/requests", { method: "POST", body: JSON.stringify(data) });

export const getRequest = (id: string) =>
  fetchApi(`/api/requests/${id}`);

export const listRequests = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchApi(`/api/requests${qs}`);
};

export const updateRequestStatus = (id: string, status: string) =>
  fetchApi(`/api/requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Matches
export const listMatches = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchApi(`/api/matches${qs}`);
};

export const getMatch = (id: string) =>
  fetchApi(`/api/matches/${id}`);

export const updateMatch = (id: string, data: Record<string, unknown>) =>
  fetchApi(`/api/matches/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const createManualMatch = (data: Record<string, unknown>) =>
  fetchApi("/api/matches/manual", { method: "POST", body: JSON.stringify(data) });

// Coordinator
export const getCoordinatorFeed = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchApi(`/api/coordinator/feed${qs}`);
};

export const getOpenRequests = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchApi(`/api/coordinator/requests${qs}`);
};

export const getFulfilledRequests = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchApi(`/api/coordinator/fulfilled${qs}`);
};

export const getAnalytics = () =>
  fetchApi("/api/coordinator/analytics");

// Admin
export const triggerScan = () =>
  fetchApi("/api/admin/trigger-scan", { method: "POST" });
