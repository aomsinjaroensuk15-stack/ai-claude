import { createFileRoute } from "@tanstack/react-router";
import { normalizeBaseUrl } from "@/lib/unikey";

type IncomingMessage = { role?: unknown; content?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: {
          apiKey?: unknown;
          model?: unknown;
          baseUrl?: unknown;
          messages?: unknown;
        };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "คำขอไม่ถูกต้อง" }, { status: 400 });
        }

        const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
        const model = typeof body.model === "string" ? body.model.trim() : "";
        if (!apiKey) {
          return Response.json({ error: "ยังไม่ได้ใส่ API Key" }, { status: 401 });
        }
        if (!model) {
          return Response.json({ error: "ยังไม่ได้เลือกโมเดล" }, { status: 400 });
        }

        const messages = Array.isArray(body.messages)
          ? (body.messages as IncomingMessage[])
              .filter(
                (m) =>
                  (m.role === "user" ||
                    m.role === "assistant" ||
                    m.role === "system") &&
                  typeof m.content === "string",
              )
              .map((m) => ({ role: m.role as string, content: m.content as string }))
          : [];

        if (messages.length === 0) {
          return Response.json({ error: "ไม่มีข้อความให้ส่ง" }, { status: 400 });
        }

        const baseUrl = normalizeBaseUrl(
          typeof body.baseUrl === "string" ? body.baseUrl : "",
        );

        const upstream = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            temperature: 0.7,
          }),
        });

        if (!upstream.ok || !upstream.body) {
          let detail = `UniKey ตอบกลับด้วยรหัส ${upstream.status}`;
          try {
            const err = (await upstream.json()) as {
              error?: { message?: string } | string;
            };
            if (typeof err.error === "string") detail = err.error;
            else if (err.error?.message) detail = err.error.message;
          } catch {
            /* keep default */
          }
          const status = upstream.status === 401 ? 401 : 502;
          return Response.json({ error: detail }, { status });
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
