import { AnimatedZoneSlot, PointerDroppable } from "@tcg/simulator-ui";
import type { ReactNode } from "react";

import { DIRECT_ATTACK_TARGET } from "../../attack-interactions.ts";
import { m } from "../../../lib/i18n/messages.ts";
import { useLayoutMode } from "../../../lib/use-layout-mode.ts";
import { cn } from "../../../lib/utils.ts";
import type { GameCardData, PlayerInfo } from "../types.ts";
import { AttackDropCue } from "./AttackDropCue.tsx";
import { BaseSection } from "./BaseSection.tsx";
import type { SeatSide } from "./PlayerSeat.tsx";
import { ShieldPips } from "./ShieldPips.tsx";
import { encodeGundamAttackTarget, useGundamDragState } from "./gundam-drag-drop-context.tsx";

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
  readonly selectedCardIds?: readonly string[];
  readonly highlightCardIds?: readonly string[];
  readonly onBaseCardClick?: (cardId: string) => void;
  readonly onShieldCardClick?: (cardId: string) => void;
  readonly dense?: boolean;
  /** Parent combat core is compact even if the global layout remains desktop. */
  readonly compactLayout?: boolean;
  readonly className?: string;
}

export function PlayerSeatPlate({
  side,
  player,
  base = [],
  shields: shieldCards = [],
  isViewer,
  playerId = player.name,
  selectedCardIds = [],
  highlightCardIds = [],
  onBaseCardClick,
  onShieldCardClick,
  dense = false,
  compactLayout = false,
  className,
}: PlayerSeatPlateProps) {
  const shields = player.shields ?? 6;
  const lowShields = shields <= 2;
  const isCompactLayout = compactLayout || useLayoutMode() !== "desktop";

  if (isCompactLayout) {
    return (
      <AttackPlayerDropTarget isViewer={isViewer}>
        <div
          aria-label={player.name}
          // Same direct-attack anchor as desktop. The compact layout still
          // reads as the opponent's "shields + base" zone for arrow targeting.
          data-direct-target={isViewer ? undefined : "opp"}
          data-sim-player-target-id={playerId}
          className={cn(
            "grid h-full w-full grid-cols-[52px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_44px] items-center gap-x-1.5 gap-y-1 px-1.5 py-1",
            className,
          )}
        >
          <BaseBlock
            base={base}
            side={side}
            isViewer={isViewer}
            zoneId={`baseSection:${playerId}`}
            selectedCardIds={selectedCardIds}
            highlightCardIds={highlightCardIds}
            onBaseCardClick={onBaseCardClick}
            compact
            dense={dense}
            edge
            split
            className="min-w-0"
          />
          <div className="col-start-2 row-start-2 h-full min-w-0">
            <ShieldsBlock
              shields={shields}
              shieldCards={shieldCards}
              lowShields={lowShields}
              isViewer={isViewer}
              zoneId={`shieldArea:${playerId}`}
              selectedCardIds={selectedCardIds}
              highlightCardIds={highlightCardIds}
              onShieldCardClick={onShieldCardClick}
              compact
              condensed
            />
          </div>
        </div>
      </AttackPlayerDropTarget>
    );
  }

  return (
    <AttackPlayerDropTarget isViewer={isViewer}>
      <div
        aria-label={player.name}
        // The opponent's plate doubles as the target anchor after a direct
        // attack has been declared.
        data-direct-target={isViewer ? undefined : "opp"}
        data-sim-player-target-id={playerId}
        className={cn(
          "grid h-full min-h-0 w-full flex-shrink-0 grid-cols-[minmax(0,1fr)_76px] grid-rows-[minmax(0,1fr)] items-center gap-2 overflow-hidden px-2 py-1",
          className,
        )}
      >
        <BaseBlock
          base={base}
          side={side}
          isViewer={isViewer}
          zoneId={`baseSection:${playerId}`}
          selectedCardIds={selectedCardIds}
          highlightCardIds={highlightCardIds}
          onBaseCardClick={onBaseCardClick}
          compact
          dense={dense}
        />
        <ShieldsBlock
          shields={shields}
          shieldCards={shieldCards}
          lowShields={lowShields}
          isViewer={isViewer}
          zoneId={`shieldArea:${playerId}`}
          selectedCardIds={selectedCardIds}
          highlightCardIds={highlightCardIds}
          onShieldCardClick={onShieldCardClick}
          compact
          condensed
        />
      </div>
    </AttackPlayerDropTarget>
  );
}

function AttackPlayerDropTarget({
  isViewer,
  children,
}: {
  readonly isViewer: boolean;
  readonly children: ReactNode;
}) {
  const activeSource = useGundamDragState();
  if (isViewer) return children;

  const isCandidate =
    activeSource?.type === "attack-unit" &&
    activeSource.legalTargetIds.includes(DIRECT_ATTACK_TARGET);
  const [directActionLabel, directDamageDetail] =
    activeSource?.type === "attack-unit"
      ? activeSource.directTargetLabel.split(" · ", 2)
      : ["Attack player", undefined];

  return (
    <PointerDroppable
      id={encodeGundamAttackTarget({
        type: "attack-target",
        targetId: DIRECT_ATTACK_TARGET,
      })}
      disabled={!isCandidate}
      className="relative h-full w-full"
      data-attack-drop-candidate={isCandidate ? "true" : undefined}
      data-testid={isCandidate ? "attack-drop-target-player" : undefined}
    >
      {({ isOver }) => (
        <>
          {children}
          {isCandidate ? (
            <AttackDropCue
              variant="player"
              isOver={isOver}
              label={directActionLabel}
              detail={directDamageDetail}
            />
          ) : null}
        </>
      )}
    </PointerDroppable>
  );
}

interface ShieldsBlockProps {
  readonly shields: number;
  readonly shieldCards: readonly GameCardData[];
  readonly lowShields: boolean;
  readonly isViewer: boolean;
  readonly zoneId?: string;
  readonly selectedCardIds?: readonly string[];
  readonly highlightCardIds?: readonly string[];
  readonly onShieldCardClick?: (cardId: string) => void;
  readonly compact?: boolean;
  readonly condensed?: boolean;
  readonly inline?: boolean;
}

function ShieldsBlock({
  shields,
  shieldCards,
  lowShields,
  isViewer,
  zoneId,
  selectedCardIds,
  highlightCardIds,
  onShieldCardClick,
  compact = false,
  condensed = false,
  inline = false,
}: ShieldsBlockProps) {
  const listLabel = isViewer
    ? m["sim.seat.shields.listLabelSelf"]()
    : m["sim.seat.shields.listLabelOpponent"]();
  const color = lowShields ? "#ff4d5e" : "var(--color-hud-accent-hot)";

  if (compact) {
    if (condensed && !inline) {
      const content = (
        <div
          className="relative h-full min-h-0 w-[76px] overflow-hidden rounded-sm border border-hud-border/40 bg-hud-deep/65"
          data-sim-zone-id={zoneId}
        >
          <ShieldPips
            zoneId={zoneId}
            value={shields}
            max={6}
            low={lowShields}
            listLabel={listLabel}
            shields={shieldCards}
            selectedCardIds={selectedCardIds}
            highlightCardIds={highlightCardIds}
            onShieldCardClick={onShieldCardClick}
            compact
            fill
            previewSide={isViewer ? "right" : "left"}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-1 top-1 flex items-baseline justify-between gap-1"
          >
            <span className="whitespace-nowrap font-mono text-[8px] font-bold uppercase tracking-[.06em] text-hud-text">
              {m["sim.seat.shields.label"]()}
            </span>
            <span
              className="whitespace-nowrap font-display text-hud-xs font-extrabold tracking-hud-body"
              style={{ color }}
            >
              {String(shields).padStart(2, "0")}
              <span className="text-hud-2xs text-hud-text-muted">/06</span>
            </span>
          </div>
        </div>
      );

      return zoneId ? (
        <AnimatedZoneSlot
          animationRef={{ kind: "zone", id: zoneId, ownerId: ownerIdFromZoneId(zoneId) }}
          className="h-full min-h-0 w-full"
        >
          {content}
        </AnimatedZoneSlot>
      ) : (
        content
      );
    }

    const content = (
      <div
        className={cn(
          condensed
            ? "flex min-w-0 items-center gap-1.5"
            : "flex h-full w-full min-w-0 items-center justify-center",
          condensed &&
            "grid h-full w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 rounded-sm border border-hud-border/40 bg-hud-deep/65 px-1.5 py-0.5",
        )}
        data-sim-zone-id={zoneId}
      >
        {condensed ? (
          <span className="whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-[.12em] text-hud-text">
            {m["sim.seat.shields.label"]()}
          </span>
        ) : null}
        <ShieldPips
          zoneId={zoneId}
          value={shields}
          max={6}
          low={lowShields}
          listLabel={listLabel}
          shields={shieldCards}
          selectedCardIds={selectedCardIds}
          highlightCardIds={highlightCardIds}
          onShieldCardClick={onShieldCardClick}
          compact={condensed}
          inline={inline}
          previewSide={isViewer ? "right" : "left"}
        />
        {condensed ? (
          <span
            className="whitespace-nowrap font-display text-hud-lg font-extrabold tracking-hud-body"
            style={{ color }}
          >
            {String(shields).padStart(2, "0")}
            <span className="opacity-40 text-hud-xs">/06</span>
          </span>
        ) : null}
      </div>
    );
    return zoneId ? (
      <AnimatedZoneSlot
        animationRef={{ kind: "zone", id: zoneId, ownerId: ownerIdFromZoneId(zoneId) }}
        className="h-full w-full"
      >
        {content}
      </AnimatedZoneSlot>
    ) : (
      content
    );
  }

  const content = (
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
          zoneId={zoneId}
          value={shields}
          max={6}
          low={lowShields}
          listLabel={listLabel}
          shields={shieldCards}
          selectedCardIds={selectedCardIds}
          highlightCardIds={highlightCardIds}
          onShieldCardClick={onShieldCardClick}
          previewSide={isViewer ? "right" : "left"}
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
  return zoneId ? (
    <AnimatedZoneSlot
      animationRef={{ kind: "zone", id: zoneId, ownerId: ownerIdFromZoneId(zoneId) }}
      className="h-full w-full"
    >
      {content}
    </AnimatedZoneSlot>
  ) : (
    content
  );
}

function ownerIdFromZoneId(zoneId: string): string {
  const separator = zoneId.indexOf(":");
  return separator >= 0 ? zoneId.slice(separator + 1) : "";
}

interface BaseBlockProps {
  readonly base: readonly GameCardData[];
  readonly side: SeatSide;
  readonly isViewer: boolean;
  readonly zoneId?: string;
  readonly selectedCardIds: readonly string[];
  readonly highlightCardIds: readonly string[];
  readonly onBaseCardClick?: (cardId: string) => void;
  readonly compact?: boolean;
  readonly dense?: boolean;
  readonly tight?: boolean;
  readonly edge?: boolean;
  readonly split?: boolean;
  readonly className?: string;
}

function BaseBlock({
  base,
  side,
  isViewer,
  zoneId,
  selectedCardIds,
  highlightCardIds,
  onBaseCardClick,
  compact = false,
  dense = false,
  tight = false,
  edge = false,
  split = false,
  className,
}: BaseBlockProps) {
  const armor = base[0]?.hp ?? null;
  const label = isViewer
    ? m["sim.seat.base.listLabelSelf"]()
    : m["sim.seat.base.listLabelOpponent"]();

  if (compact && split) {
    return (
      <>
        <div className="col-start-1 row-span-2 self-center">
          <BaseSection
            cards={base}
            label={label}
            isTop={side === "top"}
            zoneId={zoneId}
            selectedCardIds={selectedCardIds}
            highlightCardIds={highlightCardIds}
            onCardClick={onBaseCardClick}
            compact
            edge={edge}
          />
        </div>
        <div className={cn("col-start-2 row-start-1 min-w-0 self-center leading-none", className)}>
          <div className="truncate font-display text-hud-xs font-extrabold uppercase tracking-hud-body text-hud-text">
            {base[0]?.name ?? m["sim.seat.base.empty"]()}
          </div>
          <div
            className="mt-1 font-display text-hud-lg font-extrabold tracking-hud-body text-hud-accent-hot"
            aria-label={
              armor === null
                ? m["sim.seat.base.empty"]()
                : m["sim.seat.base.armor"]({ value: armor })
            }
          >
            {armor === null ? "—" : `HP ${armor}`}
          </div>
        </div>
      </>
    );
  }

  if (compact) {
    return (
      <div className={cn("relative flex min-h-0 items-center gap-1.5", className)}>
        <BaseSection
          cards={base}
          label={label}
          isTop={side === "top"}
          zoneId={zoneId}
          selectedCardIds={selectedCardIds}
          highlightCardIds={highlightCardIds}
          onCardClick={onBaseCardClick}
          compact
          dense={dense}
          tight={tight}
          edge={edge}
        />
        <div className="min-w-0 space-y-1 leading-none">
          <div className="font-mono text-hud-2xs font-bold uppercase tracking-hud-label text-hud-text-dim">
            {m["sim.seat.base.label"]()}
          </div>
          <div className="truncate font-display text-hud-xs font-extrabold uppercase tracking-hud-body text-hud-text">
            {base[0]?.name ?? m["sim.seat.base.empty"]()}
          </div>
          <div
            className="font-display text-hud-lg font-extrabold tracking-hud-body text-hud-accent-hot"
            aria-label={
              armor === null
                ? m["sim.seat.base.empty"]()
                : m["sim.seat.base.armor"]({ value: armor })
            }
          >
            {armor === null ? "—" : `HP ${armor}`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="font-mono text-hud-2xs text-hud-text-faint font-bold tracking-hud-label">
        {m["sim.seat.base.label"]()}
      </div>
      <BaseSection
        cards={base}
        label={label}
        isTop={side === "top"}
        zoneId={zoneId}
        selectedCardIds={selectedCardIds}
        highlightCardIds={highlightCardIds}
        onCardClick={onBaseCardClick}
      />
      {armor !== null && (
        <div className="font-mono text-center text-hud-2xs text-hud-text-dim tracking-hud-label">
          {m["sim.seat.base.armor"]({ value: armor })}
        </div>
      )}
    </div>
  );
}
