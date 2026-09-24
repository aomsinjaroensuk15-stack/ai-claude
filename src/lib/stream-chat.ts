export async function streamChat(options: {
  apiKey: string;
  model: string;
  baseUrl: string;
  messages: Array<{ role: string; content: string }>;
  signal?: AbortSignal;
  onDelta: (text: string) => void;
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: options.apiKey,
      model: options.model,
      baseUrl: options.baseUrl,
      messages: options.messages,
    }),
    signal: options.signal,
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok) {
    let message = "ส่งข้อความไม่สำเร็จ";
    try {
      const json = (await res.json()) as { error?: string };
      if (json.error) message = json.error;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }

  if (!contentType.includes("text/event-stream") || !res.body) {
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    if (text) options.onDelta(text);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const delta = json.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta) options.onDelta(delta);
      } catch {
        /* ignore malformed chunks */
      }
    }
  }
}
