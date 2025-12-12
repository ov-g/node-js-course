const TOKEN_KEY = "quote_journal_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json"
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  // Handle auth expiration / missing token
  if (res.status === 401) {
    clearToken();
    // If you are on a JWT page, redirect to JWT login
    if (location.pathname.startsWith("/jwt")) {
      location.href = "/jwt/login";
    }
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return { ok: res.ok, status: res.status, data: null };

  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}
