import { createFileRoute } from "@tanstack/react-router";
import { FALLBACK_MODELS, normalizeBaseUrl } from "@/lib/unikey";

export const Route = createFileRoute("/api/models")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { apiKey?: unknown; baseUrl?: unknown };
        try {
          body = await request.json();
        } catch {
          return Response.json({ models: FALLBACK_MODELS });
        }

        const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
        const baseUrl = normalizeBaseUrl(
          typeof body.baseUrl === "string" ? body.baseUrl : "",
        );

        if (!apiKey) {
          return Response.json({ models: FALLBACK_MODELS });
        }

        try {
          const res = await fetch(`${baseUrl}/models`, {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          if (!res.ok) {
            return Response.json({ models: FALLBACK_MODELS });
          }
          const json = (await res.json()) as {
            data?: Array<{ id?: string }>;
          };
          const models = (json.data ?? [])
            .map((m) => m.id)
            .filter((id): id is string => Boolean(id))
            .slice(0, 80)
            .map((id) => ({ id, label: id }));
          return Response.json({
            models: models.length ? models : FALLBACK_MODELS,
          });
        } catch {
          return Response.json({ models: FALLBACK_MODELS });
        }
      },
    },
  },
});
