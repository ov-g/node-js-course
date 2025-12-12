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

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  return res.json();
}

export async function findUserByEmail(email) {
  const users = await api(`/users?email=${encodeURIComponent(email)}`);
  return users[0] || null;
}

export async function createUser(user) {
  return api("/users", { method: "POST", body: JSON.stringify(user) });
}
