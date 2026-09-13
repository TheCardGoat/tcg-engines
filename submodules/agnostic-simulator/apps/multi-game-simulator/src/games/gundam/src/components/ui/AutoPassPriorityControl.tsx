import { FastForward } from "lucide-react";

import { useAutoPassWhenNoValidAction } from "../../lib/auto-pass-settings.tsx";

export function AutoPassPriorityControl({ className }: { readonly className?: string }) {
  const { enabled, ready, setEnabled } = useAutoPassWhenNoValidAction();

  return (
    <label className={className} style={{ display: "grid", gap: 4, minWidth: 0 }}>
      <span
        className="min-h-11"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
        }}
      >
        <FastForward size={15} className="shrink-0" aria-hidden="true" />
        <span>Auto-pass unavailable responses</span>
        <input
          className="h-5 w-5 shrink-0"
          type="checkbox"
          checked={enabled}
          disabled={!ready}
          aria-label="Auto-pass unavailable responses"
          onChange={(event) => setEnabled(event.currentTarget.checked)}
          style={{ marginLeft: "auto" }}
        />
      </span>
      <span style={{ fontSize: 11, lineHeight: 1.35, opacity: 0.78 }}>
        Automatically decline Block and Action windows when no legal Blocker, Action Command, or
        Activate·Action effect is available.
      </span>
    </label>
  );
}
