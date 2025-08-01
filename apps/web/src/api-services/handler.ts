import { useAuthStore } from "@/store";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, any>;
  pathParams?: Record<string, string | number>;
  signal?: AbortSignal;
}

export class HttpError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_SERVER_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

function buildUrl(
  url: string, 
  query?: Record<string, any>, 
  pathParams?: Record<string, string | number>
) {
  let finalUrl = url;
  
  // Replace path parameters like {id} with actual values
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      finalUrl = finalUrl.replace(`{${key}}`, String(value));
    });
  }
  
  if (!query) return `${API_BASE_URL}${finalUrl}`;
  
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    params.append(k, v == null ? "" : String(v));
  });
  
  return `${API_BASE_URL}${finalUrl}?${params.toString()}`;
}

export async function http<T>(
  url: string,
  options: HttpOptions = {}
): Promise<{ data: T; headers: Headers }> {
  const { method = "GET", headers = {}, body, query, pathParams, signal } = options;
  
  const response = await fetch(buildUrl(url, query, pathParams), {
    method,
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${useAuthStore.getState().accessToken}`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
    credentials: "include",
  }).catch((e) => {
    throw new HttpError(0, "Network error", e);
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    throw new HttpError(
      response.status,
      data?.message || response.statusText,
      data
    );
  }

  return { data: data as T, headers: response.headers };
}

export const get = <T>(url: string, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(url, { ...options, method: "GET" });

export const post = <T, B>(url: string, body?: B, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(url, { ...options, method: "POST", body });

export const put = <T, B>(url: string, body?: B, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(url, { ...options, method: "PUT", body });

export const patch = <T, B>(url: string, body?: B, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(url, { ...options, method: "PATCH", body });

export const del = <T>(url: string, options?: Omit<HttpOptions, "method" | "body">) =>
  http<T>(url, { ...options, method: "DELETE" });
