// lib/config.ts
// Where your mobile device exposes the local LLM API.
// Change this to your phone's LAN IP + port, or a adb reverse URL for dev.
export const MOBILE_API_BASE =
  process.env.NEXT_PUBLIC_MOBILE_API_BASE || "http://192.168.1.50:8080";

// Example endpoints your phone should serve:
// POST /chat  -> { prompt: string } -> { reply: string }
// POST /score -> { playerId: string } -> { series: Array<{t:number,v:number}> }
