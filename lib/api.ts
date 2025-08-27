// lib/api.ts
import axios from "axios";
import { MOBILE_API_BASE } from "./config";

/**
 * Direct call to the phone (CORS may block in browsers).
 * Prefer going through /api/proxy in production web.
 */
export async function sendToPhone<T = any>(
  path: string,
  data?: unknown,
  init?: { method?: "POST" | "GET" }
): Promise<T> {
  const method = init?.method ?? "POST";
  const url = `${MOBILE_API_BASE}${path}`;
  const res = await axios.request<T>({ url, method, data });
  return res.data;
}

/**
 * Safer: web -> Next API route -> phone (bypasses CORS via server side).
 */
export async function sendViaProxy<T = any>(
  path: string,
  payload?: unknown,
  init?: { method?: "POST" | "GET" }
): Promise<T> {
  const method = init?.method ?? "POST";
  const res = await axios.request<T>({
    url: `/api/proxy?path=${encodeURIComponent(path)}`,
    method,
    data: payload,
  });
  return res.data;
}

// Chat helpers
export async function chatOnce(prompt: string): Promise<string> {
  const data = await sendViaProxy<{ reply: string }>("/chat", { prompt });
  return data.reply ?? "";
}

// Analysis helpers
export type SeriesPoint = { t: number; v: number };
export async function fetchPerformance(
  playerId: string
): Promise<SeriesPoint[]> {
  const data = await sendViaProxy<{ series: SeriesPoint[] }>("/score", {
    playerId,
  });
  return data.series ?? [];
}
