import type { BoardBlock, SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { CardZone } from "./CardZone";

export interface ZoneFrameProps {
  block: BoardBlock;
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  note?: string;
  compact?: boolean;
  ariaLabel?: string;
}

export function ZoneFrame({
  block,
  zone,
  entities,
  entityCount,
  note = "",
  compact = false,
  ariaLabel,
}: ZoneFrameProps) {
  const eyebrowClass =
    "eyebrow text-[12px] font-extrabold leading-tight tracking-normal text-[var(--game-accent)] uppercase";

  return (
    <div className="zone-frame grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-2.5">
      <div className="board-block-header grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div>
          <p className={compact ? `${eyebrowClass} text-[10px]` : eyebrowClass}>
            {zone?.role ?? "zone"} | {zone?.visibility ?? "public"}
          </p>
          <h3 className="mt-1 break-words text-[15px] font-black leading-tight text-[var(--board-text)]">
            {block.label}
          </h3>
        </div>
        <span className="grid min-h-7 min-w-7 place-items-center rounded-full bg-[var(--surface-strong)] px-1 text-xs font-black text-white">
          {entityCount}
        </span>
      </div>
      {!compact && note && (
        <p className="board-note text-xs leading-snug text-[var(--board-muted)]">{note}</p>
      )}
      <CardZone
        zone={zone}
        entities={entities}
        entityCount={entityCount}
        compact={compact}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}
