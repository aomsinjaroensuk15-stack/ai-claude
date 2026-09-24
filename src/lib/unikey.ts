export const UNIKEY_DEFAULT_BASE = "https://www.getunikey.ai/v1";

export const FALLBACK_MODELS = [
  { id: "unikey-router", label: "UniKey Router" },
  { id: "gpt-5.2", label: "GPT-5.2" },
  { id: "gpt-5.4-mini", label: "GPT-5.4 Mini" },
  { id: "gpt-5-nano", label: "GPT-5 Nano" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
  { id: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
  { id: "deepseek-v3.2", label: "DeepSeek V3.2" },
] as const;

export function normalizeBaseUrl(raw: string) {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return UNIKEY_DEFAULT_BASE;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return UNIKEY_DEFAULT_BASE;
    }
    return trimmed;
  } catch {
    return UNIKEY_DEFAULT_BASE;
  }
}
