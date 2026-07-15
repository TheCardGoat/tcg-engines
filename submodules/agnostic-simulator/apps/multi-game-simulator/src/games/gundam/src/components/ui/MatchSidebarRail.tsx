import { MessageSquareText } from "lucide-react";

import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";

export interface MatchSidebarRailProps {
  readonly onOpenDrawer: () => void;
  readonly onConcede: () => void;
}

export function MatchSidebarRail({ onOpenDrawer, onConcede }: MatchSidebarRailProps) {
  return (
    <aside
      aria-label={m["sim.sidebar.rail.regionLabel"]()}
      className="relative flex w-[48px] flex-shrink-0 flex-col items-center gap-2 border-r border-hud-border py-2"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,254,.98))",
      }}
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px]"
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
        className="clip-hud-6 h-[32px] w-[32px] text-base font-black text-hud-accent"
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
        className="clip-hud-5 h-[32px] w-[32px] border-hud-info/30 bg-hud-info/15 text-hud-info"
      >
        <MessageSquareText aria-hidden="true" className="h-[18px] w-[18px] stroke-[2.25]" />
      </Button>

      <div className="flex-1" />

      <Button
        title={m["sim.sidebar.footer.concede"]()}
        aria-label={m["sim.sidebar.rail.concedeLabel"]()}
        data-testid="concede-action"
        variant="danger"
        size="icon"
        onClick={onConcede}
        className="clip-hud-5 h-[32px] w-[32px] text-hud-md"
      >
        !
      </Button>
    </aside>
  );
}
