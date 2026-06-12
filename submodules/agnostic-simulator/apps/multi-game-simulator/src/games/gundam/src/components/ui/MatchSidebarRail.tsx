import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";

export interface MatchSidebarRailProps {
  readonly onOpenDrawer: () => void;
  readonly onConcede: () => void;
}

/**
 * 48px collapsed sidebar shown when ?layout=v2. Clicking the brand or
 * log icon expands the full MatchSidebar inline. Concede is inlined as
 * an always-visible shortcut since it's a high-frequency action.
 *
 * The full sidebar is the source of truth — anything wired here is a
 * shortcut to a control that also lives in the expanded sidebar on desktop.
 * On mobile, the full sidebar is still presented via `MobileSidebarDrawer`.
 */
export function MatchSidebarRail({ onOpenDrawer, onConcede }: MatchSidebarRailProps) {
  return (
    <aside
      aria-label={m["sim.sidebar.rail.openLabel"]()}
      className="w-[48px] flex-shrink-0 border-r border-hud-border flex flex-col items-center py-2 gap-2 relative"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,254,.98))",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(45,107,255,.4) 0 8px, transparent 8px 14px)",
        }}
      />

      <Button
        title={m["sim.sidebar.brand.name"]()}
        aria-label={m["sim.sidebar.rail.openLabel"]()}
        variant="outline"
        size="icon"
        onClick={onOpenDrawer}
        className="font-display clip-hud-6 w-[32px] h-[32px] text-hud-accent text-base font-black"
        style={{
          background: "linear-gradient(135deg,#1e49c7 0%, #1c4cd1 100%)",
          border: "1px solid rgba(45,107,255,.5)",
          boxShadow: "inset 0 0 8px rgba(45,107,255,.2)",
        }}
      >
        G
      </Button>

      <Button
        title={m["sim.sidebar.log.regionLabel"]()}
        aria-label={m["sim.sidebar.rail.logLabel"]()}
        variant="outline"
        size="icon"
        onClick={onOpenDrawer}
        className="font-mono clip-hud-5 w-[32px] h-[32px] text-hud-info border-hud-info/30 bg-hud-info/15 text-hud-lg"
      >
        ☰
      </Button>

      <div className="flex-1" />

      <Button
        title={m["sim.sidebar.footer.concede"]()}
        aria-label={m["sim.sidebar.rail.concedeLabel"]()}
        data-testid="concede-action"
        variant="danger"
        size="icon"
        onClick={onConcede}
        className="clip-hud-5 w-[32px] h-[32px] text-hud-md"
      >
        ☠
      </Button>
    </aside>
  );
}
