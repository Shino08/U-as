const BASE_URL = import.meta.env["VITE_API_URL"] || "http://localhost:3000/api";

function getToken(): string | null {
  return localStorage.getItem("lumiere_token");
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("lumiere_token");
    localStorage.removeItem("lumiere_user");
    const body = await res.json().catch(() => ({}));
    if (!endpoint.includes("/auth/login")) {
      window.location.href = "/login";
    }
    throw new Error(body.error || "No autorizado");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint),
  post: <T = any>(endpoint: string, data?: any) => {
    const init: RequestInit = { method: "POST" };
    if (data instanceof FormData) {
      init.body = data;
    } else if (data !== undefined) {
      init.body = JSON.stringify(data);
    }
    return request<T>(endpoint, init);
  },
  upload: <T = any>(endpoint: string, formData: FormData) => {
    return request<T>(endpoint, { method: "POST", body: formData });
  },
  put: <T = any>(endpoint: string, data?: any) => {
    const init: RequestInit = { method: "PUT" };
    if (data instanceof FormData) {
      init.body = data;
    } else if (data !== undefined) {
      init.body = JSON.stringify(data);
    }
    return request<T>(endpoint, init);
  },
  delete: <T = any>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

export default api;
