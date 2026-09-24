import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FALLBACK_MODELS, UNIKEY_DEFAULT_BASE } from "@/lib/unikey";
import { useChatStore } from "@/lib/chat-store";

type ModelOption = { id: string; label: string };

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const settings = useChatStore((s) => s.settings);
  const setSettings = useChatStore((s) => s.setSettings);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);
  const [models, setModels] = useState<ModelOption[]>([...FALLBACK_MODELS]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open) return;
    setApiKey(settings.apiKey);
    setModel(settings.model);
    setBaseUrl(settings.baseUrl);
  }, [open, settings]);

  async function loadModels(key: string, url: string) {
    setLoadingModels(true);
    try {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key, baseUrl: url }),
      });
      const json = (await res.json()) as { models?: ModelOption[] };
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
      baseUrl: baseUrl.trim() || UNIKEY_DEFAULT_BASE,
    });
    setStatus("บันทึกแล้ว — คีย์อยู่บนเครื่องนี้เท่านั้น");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>การตั้งค่า UniKey</DialogTitle>
        <DialogDescription>
          ใส่ API Key จาก getunikey.ai คีย์ถูกเก็บในเบราว์เซอร์เท่านั้น
          ไม่ถูกอัปขึ้น Git
        </DialogDescription>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              autoComplete="off"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="model">โมเดล</Label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {!models.some((m) => m.id === model) && (
                <option value={model}>{model}</option>
              )}
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              disabled={!apiKey.trim() || loadingModels}
              onClick={() => loadModels(apiKey.trim(), baseUrl)}
            >
              {loadingModels ? "กำลังดึงโมเดล..." : "ดึงรายการโมเดล"}
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="base-url">Base URL</Label>
            <Input
              id="base-url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>
          {status ? <p className="text-xs text-muted">{status}</p> : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="button" onClick={save}>
              บันทึก
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setApiKey("");
                setSettings({ apiKey: "" });
                setStatus("ล้างคีย์แล้ว");
              }}
            >
              ล้างคีย์
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
