import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyRound,
  Menu,
  Plus,
  Send,
  Settings,
  Square,
  Trash2,
} from "lucide-react";
import { Markdown } from "@/components/markdown";
import { SettingsDialog } from "@/components/settings-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/lib/chat-store";
import { streamChat } from "@/lib/stream-chat";
import { cn, uid } from "@/lib/utils";

export function ChatApp() {
  const hydrated = useChatStore((s) => s.hydrated);
  const setHydrated = useChatStore((s) => s.setHydrated);
  const settings = useChatStore((s) => s.settings);
  const conversations = useChatStore((s) => s.conversations);
  const currentId = useChatStore((s) => s.currentId);
  const newChat = useChatStore((s) => s.newChat);
  const selectChat = useChatStore((s) => s.selectChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const unsub = useChatStore.persist.onFinishHydration(() => setHydrated());
    if (useChatStore.persist.hasHydrated()) setHydrated();
    return unsub;
  }, [setHydrated]);

  const current = useMemo(
    () => conversations.find((c) => c.id === currentId) ?? null,
    [conversations, currentId],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [current?.messages, busy]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    if (!settings.apiKey) {
      setSettingsOpen(true);
      setError("ใส่ UniKey API Key ก่อนเริ่มคุย");
      return;
    }

    let convoId = currentId;
    if (!convoId) convoId = newChat();

    const userMsg = { id: uid(), role: "user" as const, content: text };
    const assistantId = uid();
    appendMessage(convoId, userMsg);
    appendMessage(convoId, {
      id: assistantId,
      role: "assistant",
      content: "",
    });
    setDraft("");
    setError("");
    setBusy(true);

    const history = [
      ...(useChatStore
        .getState()
        .conversations.find((c) => c.id === convoId)
        ?.messages.filter((m) => m.id !== assistantId) ?? []),
    ].map((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;
    let assembled = "";

    try {
      await streamChat({
        apiKey: settings.apiKey,
        model: settings.model,
        baseUrl: settings.baseUrl,
        messages: [
          {
            role: "system",
            content:
              "You are AI Creator, a helpful assistant. Reply in the same language the user writes.",
          },
          ...history,
        ],
        signal: controller.signal,
        onDelta: (chunk) => {
          assembled += chunk;
          updateMessage(convoId!, assistantId, assembled);
        },
      });
      if (!assembled) {
        updateMessage(
          convoId,
          assistantId,
          "โมเดลไม่ได้ส่งข้อความกลับมา ลองเปลี่ยนโมเดลหรือตรวจคีย์อีกครั้ง",
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        if (!assembled) updateMessage(convoId, assistantId, "(หยุดแล้ว)");
      } else {
        const message =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
        setError(message);
        updateMessage(convoId, assistantId, assembled || `ข้อผิดพลาด: ${message}`);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-muted">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-bg text-fg">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-200 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-accent" />
            <span className="text-sm font-semibold tracking-tight">AI Creator</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="ปิดเมนู"
          >
            <Menu className="size-4" />
          </Button>
        </div>
        <div className="px-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              newChat();
              setSidebarOpen(false);
            }}
          >
            <Plus className="size-4" />
            แชทใหม่
          </Button>
        </div>
        <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-4">
          {conversations.length === 0 ? (
            <p className="px-3 py-6 text-xs text-subtle">ยังไม่มีประวัติแชท</p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "group mb-1 flex items-center rounded-md",
                  c.id === currentId ? "bg-elevated" : "hover:bg-elevated/60",
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate px-3 py-2.5 text-left text-sm"
                  onClick={() => {
                    selectChat(c.id);
                    setSidebarOpen(false);
                  }}
                >
                  {c.title}
                </button>
                <button
                  type="button"
                  className="mr-1 hidden size-9 items-center justify-center rounded-md text-subtle hover:text-danger group-hover:flex"
                  aria-label="ลบแชท"
                  onClick={() => deleteChat(c.id)}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </nav>
      </aside>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-bg/50 md:hidden"
          aria-label="ปิดเมนู"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-3 md:px-5">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="เปิดเมนู"
            >
              <Menu className="size-4" />
            </Button>
            <h1 className="truncate text-sm font-medium">
              {current?.title ?? "แชทใหม่"}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <span className="hidden max-w-40 truncate text-xs text-subtle sm:inline">
              {settings.model}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              aria-label="การตั้งค่า"
            >
              <Settings className="size-4" />
            </Button>
          </div>
        </header>

        <div ref={scrollerRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-4 py-8">
            {!current || current.messages.length === 0 ? (
              <EmptyState
                hasKey={Boolean(settings.apiKey)}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            ) : (
              <ul className="flex flex-col gap-6">
                {current.messages.map((m) => (
                  <li
                    key={m.id}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {m.role === "user" ? (
                      <div className="max-w-[85%] rounded-lg bg-elevated px-4 py-3 text-sm leading-relaxed">
                        {m.content}
                      </div>
                    ) : (
                      <div className="w-full max-w-[92%]">
                        {m.content ? (
                          <Markdown content={m.content} />
                        ) : (
                          <p className="text-sm text-muted">กำลังคิด...</p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-border px-3 pt-3 pb-20 md:px-5">
          <div className="mx-auto w-full max-w-2xl">
            {error ? (
              <p className="mb-2 text-xs text-danger">{error}</p>
            ) : null}
            <div className="rounded-xl border border-border bg-surface p-2 pl-3">
              <Textarea
                ref={inputRef}
                rows={1}
                value={draft}
                placeholder="พิมพ์ข้อความ..."
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
              />
              <div className="flex items-center justify-between gap-2 px-1 pb-1">
                <p className="text-[11px] text-subtle">Enter เพื่อส่ง · Shift+Enter บรรทัดใหม่</p>
                {busy ? (
                  <Button type="button" variant="outline" size="sm" onClick={stop}>
                    <Square className="size-3" />
                    หยุด
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void send()}
                    disabled={!draft.trim()}
                  >
                    <Send className="size-3.5" />
                    ส่ง
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function EmptyState({
  hasKey,
  onOpenSettings,
}: {
  hasKey: boolean;
  onOpenSettings: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <KeyRound className="size-8 text-accent" />
      <h2 className="mt-4 text-2xl font-semibold tracking-tight">AI Creator</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        {hasKey
          ? "พิมพ์ด้านล่างเพื่อเริ่มคุยผ่าน UniKey"
          : "เปิดการตั้งค่า ใส่ UniKey API Key แล้วเริ่มคุยได้ทันที"}
      </p>
      {!hasKey ? (
        <Button className="mt-5" onClick={onOpenSettings}>
          ใส่ API Key
        </Button>
      ) : null}
    </div>
  );
}
