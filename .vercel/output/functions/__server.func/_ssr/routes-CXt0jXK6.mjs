import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Settings, c as Menu, i as Square, l as KeyRound, o as Send, r as Trash2, s as Plus, t as X } from "../_libs/lucide-react.mjs";
import { n as FALLBACK_MODELS, r as UNIKEY_DEFAULT_BASE } from "./router-BRVXxUWE.mjs";
import { a as DialogOverlay, i as DialogDescription$1, l as Slot, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CXt0jXK6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function escapeHtml(text) {
	return text.replaceAll("&", "&").replaceAll("<", "<").replaceAll(">", ">");
}
function inline(text) {
	return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replaceAll("\n", "<br />");
}
function Markdown({ content }) {
	const parts = content.split(/```/g);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[0.95rem] leading-relaxed text-fg",
		children: parts.map((part, i) => {
			if (i % 2 === 1) {
				const nl = part.indexOf("\n");
				const code = nl === -1 ? part : part.slice(nl + 1);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "my-3 overflow-x-auto rounded-md bg-elevated p-3 font-mono text-xs text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code.replace(/\n$/, "") })
				}, i);
			}
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { dangerouslySetInnerHTML: { __html: inline(part) } }) }, i);
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return crypto.randomUUID();
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			ghost: "bg-transparent text-fg hover:bg-elevated",
			outline: "border border-border bg-transparent text-fg hover:bg-elevated",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-6 shadow-lg outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
			className: "absolute top-3 right-3 flex size-11 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-fg",
			"aria-label": "ปิด",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-semibold tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-1 text-sm text-muted", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg placeholder:text-subtle outline-none focus-visible:ring-2 focus-visible:ring-accent/50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium text-muted", className),
		...props
	});
}
function blankConversation() {
	return {
		id: uid(),
		title: "แชทใหม่",
		messages: [],
		updatedAt: Date.now()
	};
}
var useChatStore = create()(persist((set) => ({
	hydrated: false,
	settings: {
		apiKey: "",
		model: FALLBACK_MODELS[0].id,
		baseUrl: UNIKEY_DEFAULT_BASE
	},
	conversations: [],
	currentId: null,
	setHydrated: () => set({ hydrated: true }),
	setSettings: (patch) => set((s) => ({ settings: {
		...s.settings,
		...patch
	} })),
	newChat: () => {
		const chat = blankConversation();
		set((s) => ({
			conversations: [chat, ...s.conversations],
			currentId: chat.id
		}));
		return chat.id;
	},
	selectChat: (id) => set({ currentId: id }),
	deleteChat: (id) => set((s) => {
		const conversations = s.conversations.filter((c) => c.id !== id);
		return {
			conversations,
			currentId: s.currentId === id ? conversations[0]?.id ?? null : s.currentId
		};
	}),
	appendMessage: (conversationId, message) => set((s) => ({ conversations: s.conversations.map((c) => {
		if (c.id !== conversationId) return c;
		const title = c.title === "แชทใหม่" && message.role === "user" ? message.content.slice(0, 40) || c.title : c.title;
		return {
			...c,
			title,
			messages: [...c.messages, message],
			updatedAt: Date.now()
		};
	}) })),
	updateMessage: (conversationId, messageId, content) => set((s) => ({ conversations: s.conversations.map((c) => c.id !== conversationId ? c : {
		...c,
		messages: c.messages.map((m) => m.id === messageId ? {
			...m,
			content
		} : m),
		updatedAt: Date.now()
	}) }))
}), {
	name: "ai-creator-chat",
	partialize: (s) => ({
		settings: s.settings,
		conversations: s.conversations,
		currentId: s.currentId
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
		if (state && !state.currentId && state.conversations[0]) state.selectChat(state.conversations[0].id);
	}
}));
function SettingsDialog({ open, onOpenChange }) {
	const settings = useChatStore((s) => s.settings);
	const setSettings = useChatStore((s) => s.setSettings);
	const [apiKey, setApiKey] = (0, import_react.useState)(settings.apiKey);
	const [model, setModel] = (0, import_react.useState)(settings.model);
	const [baseUrl, setBaseUrl] = (0, import_react.useState)(settings.baseUrl);
	const [models, setModels] = (0, import_react.useState)([...FALLBACK_MODELS]);
	const [loadingModels, setLoadingModels] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setApiKey(settings.apiKey);
		setModel(settings.model);
		setBaseUrl(settings.baseUrl);
	}, [open, settings]);
	async function loadModels(key, url) {
		setLoadingModels(true);
		try {
			const json = await (await fetch("/api/models", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					apiKey: key,
					baseUrl: url
				})
			})).json();
			if (json.models?.length) setModels(json.models);
		} catch {
			setModels([...FALLBACK_MODELS]);
		} finally {
			setLoadingModels(false);
		}
	}
	function save() {
		setSettings({
			apiKey: apiKey.trim(),
			model,
			baseUrl: baseUrl.trim() || "https://www.getunikey.ai/v1"
		});
		setStatus("บันทึกแล้ว — คีย์อยู่บนเครื่องนี้เท่านั้น");
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "การตั้งค่า UniKey" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "ใส่ API Key จาก getunikey.ai คีย์ถูกเก็บในเบราว์เซอร์เท่านั้น ไม่ถูกอัปขึ้น Git" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "api-key",
							children: "API Key"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "api-key",
							type: "password",
							autoComplete: "off",
							placeholder: "sk-...",
							value: apiKey,
							onChange: (e) => setApiKey(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "model",
								children: "โมเดล"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "model",
								value: model,
								onChange: (e) => setModel(e.target.value),
								className: "h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
								children: [!models.some((m) => m.id === model) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: model,
									children: model
								}), models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.id,
									children: m.label
								}, m.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								className: "self-start",
								disabled: !apiKey.trim() || loadingModels,
								onClick: () => loadModels(apiKey.trim(), baseUrl),
								children: loadingModels ? "กำลังดึงโมเดล..." : "ดึงรายการโมเดล"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "base-url",
							children: "Base URL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "base-url",
							value: baseUrl,
							onChange: (e) => setBaseUrl(e.target.value)
						})]
					}),
					status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: status
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: save,
							children: "บันทึก"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => {
								setApiKey("");
								setSettings({ apiKey: "" });
								setStatus("ล้างคีย์แล้ว");
							},
							children: "ล้างคีย์"
						})]
					})
				]
			})
		] })
	});
}
var Textarea = (0, import_react.forwardRef)(function Textarea({ className, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		ref,
		className: cn("min-h-12 w-full resize-none rounded-md bg-transparent px-1 py-2 text-sm text-fg placeholder:text-subtle outline-none", className),
		...props
	});
});
async function streamChat(options) {
	const res = await fetch("/api/chat", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			apiKey: options.apiKey,
			model: options.model,
			baseUrl: options.baseUrl,
			messages: options.messages
		}),
		signal: options.signal
	});
	const contentType = res.headers.get("content-type") ?? "";
	if (!res.ok) {
		let message = "ส่งข้อความไม่สำเร็จ";
		try {
			const json = await res.json();
			if (json.error) message = json.error;
		} catch {}
		throw new Error(message);
	}
	if (!contentType.includes("text/event-stream") || !res.body) {
		const text = (await res.json()).choices?.[0]?.message?.content ?? "";
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
				const delta = JSON.parse(data).choices?.[0]?.delta?.content;
				if (typeof delta === "string" && delta) options.onDelta(delta);
			} catch {}
		}
	}
}
function ChatApp() {
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
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const abortRef = (0, import_react.useRef)(null);
	const scrollerRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const unsub = useChatStore.persist.onFinishHydration(() => setHydrated());
		if (useChatStore.persist.hasHydrated()) setHydrated();
		return unsub;
	}, [setHydrated]);
	const current = (0, import_react.useMemo)(() => conversations.find((c) => c.id === currentId) ?? null, [conversations, currentId]);
	(0, import_react.useEffect)(() => {
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
		const userMsg = {
			id: uid(),
			role: "user",
			content: text
		};
		const assistantId = uid();
		appendMessage(convoId, userMsg);
		appendMessage(convoId, {
			id: assistantId,
			role: "assistant",
			content: ""
		});
		setDraft("");
		setError("");
		setBusy(true);
		const history = [...useChatStore.getState().conversations.find((c) => c.id === convoId)?.messages.filter((m) => m.id !== assistantId) ?? []].map((m) => ({
			role: m.role,
			content: m.content
		}));
		const controller = new AbortController();
		abortRef.current = controller;
		let assembled = "";
		try {
			await streamChat({
				apiKey: settings.apiKey,
				model: settings.model,
				baseUrl: settings.baseUrl,
				messages: [{
					role: "system",
					content: "You are AI Creator, a helpful assistant. Reply in the same language the user writes."
				}, ...history],
				signal: controller.signal,
				onDelta: (chunk) => {
					assembled += chunk;
					updateMessage(convoId, assistantId, assembled);
				}
			});
			if (!assembled) updateMessage(convoId, assistantId, "โมเดลไม่ได้ส่งข้อความกลับมา ลองเปลี่ยนโมเดลหรือตรวจคีย์อีกครั้ง");
		} catch (err) {
			if (err.name === "AbortError") {
				if (!assembled) updateMessage(convoId, assistantId, "(หยุดแล้ว)");
			} else {
				const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
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
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg text-muted",
		children: "กำลังโหลด..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-200 md:static md:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold tracking-tight",
								children: "AI Creator"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "size-11 md:hidden",
							onClick: () => setSidebarOpen(false),
							"aria-label": "ปิดเมนู",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "w-full justify-start",
							onClick: () => {
								newChat();
								setSidebarOpen(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "แชทใหม่"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-3 flex-1 overflow-y-auto px-2 pb-4",
						children: conversations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 py-6 text-xs text-subtle",
							children: "ยังไม่มีประวัติแชท"
						}) : conversations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("group mb-1 flex items-center rounded-md", c.id === currentId ? "bg-elevated" : "hover:bg-elevated/60"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-w-0 flex-1 truncate px-3 py-2.5 text-left text-sm",
								onClick: () => {
									selectChat(c.id);
									setSidebarOpen(false);
								},
								children: c.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mr-1 hidden size-9 items-center justify-center rounded-md text-subtle hover:text-danger group-hover:flex",
								"aria-label": "ลบแชท",
								onClick: () => deleteChat(c.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						}, c.id))
					})
				]
			}),
			sidebarOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "fixed inset-0 z-20 bg-bg/50 md:hidden",
				"aria-label": "ปิดเมนู",
				onClick: () => setSidebarOpen(false)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex h-14 items-center justify-between border-b border-border px-3 md:px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "md:hidden",
								onClick: () => setSidebarOpen(true),
								"aria-label": "เปิดเมนู",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "truncate text-sm font-medium",
								children: current?.title ?? "แชทใหม่"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden max-w-40 truncate text-xs text-subtle sm:inline",
								children: settings.model
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => setSettingsOpen(true),
								"aria-label": "การตั้งค่า",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scrollerRef,
						className: "flex-1 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto w-full max-w-2xl px-4 py-8",
							children: !current || current.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								hasKey: Boolean(settings.apiKey),
								onOpenSettings: () => setSettingsOpen(true)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-6",
								children: current.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: cn("flex", m.role === "user" ? "justify-end" : "justify-start"),
									children: m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "max-w-[85%] rounded-lg bg-elevated px-4 py-3 text-sm leading-relaxed",
										children: m.content
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full max-w-[92%]",
										children: m.content ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { content: m.content }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted",
											children: "กำลังคิด..."
										})
									})
								}, m.id))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border px-3 pt-3 pb-20 md:px-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto w-full max-w-2xl",
							children: [error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs text-danger",
								children: error
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-2 pl-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									ref: inputRef,
									rows: 1,
									value: draft,
									placeholder: "พิมพ์ข้อความ...",
									onChange: (e) => setDraft(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											send();
										}
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 px-1 pb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-subtle",
										children: "Enter เพื่อส่ง · Shift+Enter บรรทัดใหม่"
									}), busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: stop,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3" }), "หยุด"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										onClick: () => void send(),
										disabled: !draft.trim(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }), "ส่ง"]
									})]
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, {
				open: settingsOpen,
				onOpenChange: setSettingsOpen
			})
		]
	});
}
function EmptyState({ hasKey, onOpenSettings }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[50vh] flex-col items-center justify-center text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-8 text-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-2xl font-semibold tracking-tight",
				children: "AI Creator"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-muted",
				children: hasKey ? "พิมพ์ด้านล่างเพื่อเริ่มคุยผ่าน UniKey" : "เปิดการตั้งค่า ใส่ UniKey API Key แล้วเริ่มคุยได้ทันที"
			}),
			!hasKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-5",
				onClick: onOpenSettings,
				children: "ใส่ API Key"
			}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatApp, {});
}
//#endregion
export { Home as component };
