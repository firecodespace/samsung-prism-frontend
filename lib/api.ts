import axios from "axios";
import { MOBILE_API_BASE } from "./config";

export async function sendViaProxy<T = unknown>(
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

export async function chatOnce(
  message: string,
  adapter?: string
): Promise<string> {
  const payload: { message: string; adapter?: string } = { message };
  if (adapter) payload.adapter = adapter;

  const data = await sendViaProxy<{ response: string }>("/message", payload);
  return data.response ?? "";
}

export type SeriesPoint = { t: number; v: number };
export async function fetchPerformance(
  playerId: string
): Promise<SeriesPoint[]> {
  const data = await sendViaProxy<{ series: SeriesPoint[] }>("/score", {
    playerId,
  });
  return data.series ?? [];
}
