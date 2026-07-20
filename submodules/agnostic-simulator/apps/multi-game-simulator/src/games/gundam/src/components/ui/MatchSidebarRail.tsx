import { MessageSquareText } from "lucide-react";
import type { ReactNode } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";

export interface MatchSidebarRailProps {
  readonly onOpenDrawer: () => void;
  readonly onConcede: () => void;
  readonly connectionIndicator?: ReactNode;
}

export function MatchSidebarRail({
  onOpenDrawer,
  onConcede,
  connectionIndicator,
}: MatchSidebarRailProps) {
  return (
    <aside
      aria-label={m["sim.sidebar.rail.regionLabel"]()}
      className="gd-dark-surface gd-command-surface relative flex w-[52px] flex-shrink-0 flex-col items-center gap-2 border-r border-hud-border py-2"
      style={{
        boxShadow: "2px 0 10px rgba(30,73,199,.05)",
      }}
    >
      <Button
        title={m["sim.sidebar.brand.name"]()}
        aria-label={m["sim.sidebar.rail.openLabel"]()}
        variant="outline"
        size="icon"
        onClick={onOpenDrawer}
        className="h-[34px] w-[34px] rounded-sm text-base font-black text-white"
        style={{
          background: "var(--color-hud-accent-deep)",
          border: "1px solid rgba(45,107,255,.5)",
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
        className="h-[34px] w-[34px] rounded-sm border-hud-accent/30 bg-hud-accent/5 text-hud-accent-deep"
      >
        <MessageSquareText aria-hidden="true" className="h-[18px] w-[18px] stroke-[2.25]" />
      </Button>

      {connectionIndicator ? <div className="relative py-1">{connectionIndicator}</div> : null}

      <div className="flex-1" />

      <Button
        title={m["sim.sidebar.footer.concede"]()}
        aria-label={m["sim.sidebar.rail.concedeLabel"]()}
        data-testid="concede-action"
        variant="danger"
        size="icon"
        onClick={onConcede}
        className="h-[34px] w-[34px] rounded-sm text-hud-md"
      >
        !
      </Button>
    </aside>
  );
}
