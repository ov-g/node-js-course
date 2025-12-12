const BASE_URL = "http://localhost:3001";

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  // JSON Server returns empty body sometimes (e.g., DELETE)
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  return res.json();
}

export async function getAllQuotes() {
  // newest first
  return api("/quotes?_sort=createdAt&_order=desc");
}

export async function getQuoteById(id) {
  return api(`/quotes/${id}`);
}

export async function createQuote(data) {
  return api("/quotes", { method: "POST", body: JSON.stringify(data) });
}

export async function updateQuote(id, data) {
  return api(`/quotes/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteQuote(id) {
  return api(`/quotes/${id}`, { method: "DELETE" });
}
