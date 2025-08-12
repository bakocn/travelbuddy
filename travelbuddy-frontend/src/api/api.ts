export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5077/api";

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path.startsWith("http") ? path : `${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== "") url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function get<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = buildUrl(path, params);
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  return handleResponse(res) as Promise<T>;
}

export async function post<T>(path: string, body: any): Promise<T> {
  const url = buildUrl(path);
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(res) as Promise<T>;
}

export async function put<T>(path: string, body: any): Promise<T> {
  const url = buildUrl(path);
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(res) as Promise<T>;
}

export async function del(path: string): Promise<void> {
  const url = buildUrl(path);
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers
  });
  await handleResponse(res);
}

// default export for backward compatibility (userService was importing default)
export default { get, post, put, del };
