import { m } from "../../../lib/i18n/messages.ts";
import { useLayoutMode } from "../../../lib/use-layout-mode.ts";
import { cn } from "../../../lib/utils.ts";
import type { GameCardData, PlayerInfo } from "../types.ts";
import { BaseSection } from "./BaseSection.tsx";
import type { SeatSide } from "./PlayerSeat.tsx";
import { ShieldPips } from "./ShieldPips.tsx";

/**
 * Slim left-edge column inside a player seat that shows only the
 * card-zone elements that belong on the field: shields and base.
 *
 * Identity, priority, deck/scrap counts, and the hints toggle live
 * in MatchSidebar — this plate stays a thin presentational column
 * that visually reads as part of the play area.
 */
export interface PlayerSeatPlateProps {
  readonly side: SeatSide;
  readonly player: PlayerInfo;
  readonly base?: readonly GameCardData[];
  readonly shields?: readonly GameCardData[];
  readonly isViewer: boolean;
  readonly playerId?: string;
  readonly className?: string;
}

export function PlayerSeatPlate({
  side,
  player,
  base = [],
  shields: shieldCards = [],
  isViewer,
  playerId = player.name,
  className,
}: PlayerSeatPlateProps) {
  const shields = player.shields ?? 6;
  const lowShields = shields <= 2;
  const isMobile = useLayoutMode() === "mobile";

  if (isMobile) {
    return (
      <div
        aria-label={player.name}
        // Same direct-attack anchor as desktop. The compact layout still
        // reads as the opponent's "shields + base" zone for arrow targeting.
        data-direct-target={isViewer ? undefined : "opp"}
        data-sim-player-target-id={playerId}
        className={cn(
          "flex h-full w-full flex-shrink-0 items-center justify-between gap-1 px-1 py-1",
          className,
        )}
      >
        <BaseBlock
          base={base}
          side={side}
          isViewer={isViewer}
          zoneId={`baseSection:${playerId}`}
          compact
          overlayArmor
        />
        <ShieldsBlock
          shields={shields}
          shieldCards={shieldCards}
          lowShields={lowShields}
          isViewer={isViewer}
          zoneId={`shieldArea:${playerId}`}
          compact
          condensed
        />
      </div>
    );
  }

  return (
    <div
      aria-label={player.name}
      // The opponent's plate doubles as the click target for a direct
      // attack — the shared targeting overlay queries this attribute to
      // anchor its direct-target arrow and click region.
      data-direct-target={isViewer ? undefined : "opp"}
      data-sim-player-target-id={playerId}
      className={cn(
        "flex h-full w-[156px] flex-shrink-0 flex-col items-start justify-center gap-2 overflow-hidden px-3 py-2",
        className,
      )}
    >
      <ShieldsBlock
        shields={shields}
        shieldCards={shieldCards}
        lowShields={lowShields}
        isViewer={isViewer}
        zoneId={`shieldArea:${playerId}`}
        compact
      />
      <BaseBlock
        base={base}
        side={side}
        isViewer={isViewer}
        zoneId={`baseSection:${playerId}`}
        compact
      />
    </div>
  );
}

interface ShieldsBlockProps {
  readonly shields: number;
  readonly shieldCards: readonly GameCardData[];
  readonly lowShields: boolean;
  readonly isViewer: boolean;
  readonly zoneId?: string;
  readonly compact?: boolean;
  readonly condensed?: boolean;
}

function ShieldsBlock({
  shields,
  shieldCards,
  lowShields,
  isViewer,
  zoneId,
  compact = false,
  condensed = false,
}: ShieldsBlockProps) {
  const listLabel = isViewer
    ? m["sim.seat.shields.listLabelSelf"]()
    : m["sim.seat.shields.listLabelOpponent"]();
  const color = lowShields ? "#ff4d5e" : "#2d6bff";

  if (compact) {
    return (
      <div
        className={cn(
          "flex min-w-0 items-center gap-1.5",
          condensed &&
            "w-[62px] flex-col gap-1 rounded-sm border border-hud-border/30 bg-white/70 px-1 py-1.5",
        )}
        data-sim-zone-id={zoneId}
      >
        {condensed ? (
          <span className="font-mono text-[7px] font-bold uppercase tracking-hud-label text-hud-text-faint">
            {m["sim.seat.shields.label"]()}
          </span>
        ) : null}
        <ShieldPips
          value={shields}
          max={6}
          low={lowShields}
          listLabel={listLabel}
          shields={shieldCards}
          compact={condensed}
        />
        <span
          className="font-display text-hud-md font-extrabold tracking-hud-body whitespace-nowrap"
          style={{ color }}
        >
          {String(shields).padStart(2, "0")}
          <span className="opacity-40 text-[9px]">/06</span>
        </span>
      </div>
    );
  }

  return (
    <div data-sim-zone-id={zoneId}>
      <div
        className="font-display text-hud-sm font-extrabold tracking-hud-label mb-1.5"
        style={{
          color,
          textShadow: lowShields ? "0 0 8px rgba(255,45,122,.7)" : "none",
        }}
      >
        {lowShields ? m["sim.seat.shields.critical"]() : m["sim.seat.shields.label"]()}
      </div>
      <div className="flex items-center gap-2">
        <ShieldPips
          value={shields}
          max={6}
          low={lowShields}
          listLabel={listLabel}
          shields={shieldCards}
        />
        <span
          className="font-display text-hud-lg font-extrabold ml-auto tracking-hud-body"
          style={{ color }}
        >
          {String(shields).padStart(2, "0")}
          <span className="opacity-40 text-xs">/06</span>
        </span>
      </div>
    </div>
  );
}

interface BaseBlockProps {
  readonly base: readonly GameCardData[];
  readonly side: SeatSide;
  readonly isViewer: boolean;
  readonly zoneId?: string;
  readonly compact?: boolean;
  readonly overlayArmor?: boolean;
}

function BaseBlock({
  base,
  side,
  isViewer,
  zoneId,
  compact = false,
  overlayArmor = false,
}: BaseBlockProps) {
  const armor = base[0]?.hp ?? null;
  const label = isViewer
    ? m["sim.seat.base.listLabelSelf"]()
    : m["sim.seat.base.listLabelOpponent"]();

  if (compact) {
    return (
      <div className="relative flex flex-shrink-0 items-center gap-1.5">
        <BaseSection cards={base} label={label} isTop={side === "top"} zoneId={zoneId} compact />
        {armor !== null && (
          <span
            className={cn(
              "font-mono text-hud-2xs text-hud-text-dim tracking-hud-label whitespace-nowrap",
              overlayArmor &&
                "absolute bottom-1 right-1 rounded-sm border border-hud-border/40 bg-white/90 px-1 py-0.5 font-bold text-hud-text",
            )}
            aria-label={m["sim.seat.base.armor"]({ value: armor })}
          >
            ◇{armor}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="font-mono text-hud-2xs text-hud-text-faint font-bold tracking-hud-label">
        {m["sim.seat.base.label"]()}
      </div>
      <BaseSection cards={base} label={label} isTop={side === "top"} zoneId={zoneId} />
      {armor !== null && (
        <div className="font-mono text-center text-hud-2xs text-hud-text-dim tracking-hud-label">
          {m["sim.seat.base.armor"]({ value: armor })}
        </div>
      )}
    </div>
  );
}
