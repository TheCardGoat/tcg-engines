import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";

import { useAnimationNode } from "@tcg/simulator-ui";
import { gundamAnimationEntityForCard } from "../../../animation/gundamAnimationVisual.tsx";

import { cn } from "../../../lib/utils.ts";
import { Popover, PopoverContent, PopoverTrigger } from "../../primitives/index.ts";
import { CardBack } from "../card/CardBack.tsx";
import { DamageCounterOverlay } from "../card/DamageCounterOverlay.tsx";
import type { GameCardData } from "../types.ts";

interface ShieldPipsProps {
  readonly zoneId?: string;
  readonly value?: number;
  readonly max?: number;
  readonly low: boolean;
  readonly listLabel: string;
  readonly shields?: readonly GameCardData[];
  readonly compact?: boolean;
  readonly inline?: boolean;
  /** Fill a dense HUD surface while keeping the visible pips below its overlaid header. */
  readonly fill?: boolean;
  readonly previewSide?: "left" | "right";
  readonly selectedCardIds?: readonly string[];
  readonly highlightCardIds?: readonly string[];
  readonly onShieldCardClick?: (cardId: string) => void;
}

export function ShieldPips({
  zoneId,
  value = 0,
  max = 6,
  low,
  listLabel,
  shields = [],
  compact = false,
  inline = false,
  fill = false,
  previewSide = "right",
  selectedCardIds = [],
  highlightCardIds = [],
  onShieldCardClick,
}: ShieldPipsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimerRef.current === null) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const openPreview = () => {
    cancelClose();
    setPreviewOpen(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setPreviewOpen(false);
    }, 140);
  };

  useEffect(
    () => () => {
      cancelClose();
    },
    [],
  );

  const selectedShieldIds = new Set(selectedCardIds);
  const highlightedShieldIds = new Set(highlightCardIds);
  // Single click path only — avoid also handling pointerdown, which can
  // fire onShieldCardClick twice for one user gesture (pointerdown + click).
  const handleShieldStackClick = (event: MouseEvent<HTMLDivElement>) => {
    const shieldId = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-shield-card-id]",
    )?.dataset.shieldCardId;
    if (shieldId && highlightedShieldIds.has(shieldId) && onShieldCardClick) {
      event.preventDefault();
      event.stopPropagation();
      onShieldCardClick(shieldId);
      return;
    }
    openPreview();
  };
  const activeShields = Array.from({ length: value }, (_, index) => ({
    damage: shields[index]?.damage ?? 0,
    index,
  }));
  const stackHeight = 106 + Math.max(0, activeShields.length - 1) * 30;

  return (
    <Popover open={previewOpen} onOpenChange={setPreviewOpen}>
      <PopoverTrigger asChild>
        <div
          role="group"
          aria-label={`${listLabel}, ${value} of ${max}`}
          onPointerEnter={openPreview}
          onPointerLeave={scheduleClose}
          onMouseEnter={openPreview}
          onMouseLeave={scheduleClose}
          onFocus={openPreview}
          onBlur={scheduleClose}
          onClick={handleShieldStackClick}
          className={cn(
            "group/shields relative flex rounded-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-accent-hot",
            compact
              ? inline
                ? "size-11 min-h-11 min-w-11 justify-self-center items-center justify-center gap-px"
                : fill
                  ? "h-full min-h-11 w-full min-w-11 items-end justify-center gap-px pb-1"
                  : "min-h-11 w-full min-w-11 items-center justify-center gap-px"
              : "h-full -translate-y-px flex-col items-center gap-0.5 rounded-md border border-hud-border/25 bg-white/35 px-1 hover:border-hud-border-hot/60 hover:bg-white/55",
          )}
        >
          <span
            role="list"
            aria-label={listLabel}
            className={compact ? "flex gap-px" : "flex flex-col gap-0.5"}
          >
            {Array.from({ length: max }).map((_, i) => {
              const on = i < value;
              const color = on ? (low ? "#ff4d5e" : "#36ff8a") : "rgba(255,255,255,.08)";
              const glow = on
                ? low
                  ? "rgba(255,45,122,.7)"
                  : "rgba(46,166,90,.6)"
                : "transparent";
              const damage = shields[i]?.damage ?? 0;

              return (
                <ShieldAnimationSlot
                  key={i}
                  card={on ? shields[i] : undefined}
                  zoneId={zoneId}
                  active={on}
                >
                  <button
                    type="button"
                    disabled={!on || shields[i]?.id === undefined}
                    aria-label={on ? `Shield ${i + 1}` : undefined}
                    data-shield-card-id={shields[i]?.id}
                    data-targeting-state={
                      selectedShieldIds.has(shields[i]?.id ?? "")
                        ? "selected"
                        : highlightedShieldIds.has(shields[i]?.id ?? "")
                          ? "candidate"
                          : undefined
                    }
                    className={cn(
                      "relative block cursor-default transition-[transform,filter] duration-150 ease-out group-hover/shields:brightness-110 disabled:cursor-default",
                      highlightedShieldIds.has(shields[i]?.id ?? "") &&
                        "cursor-pointer rounded-sm outline outline-2 outline-hud-accent-hot outline-offset-1",
                      compact ? "h-2 w-2" : "h-[12px] w-[34px]",
                    )}
                  >
                    <span
                      className={cn("absolute inset-0", compact ? "clip-hud-3" : "rounded-[4px]")}
                      style={{
                        background: on
                          ? `linear-gradient(180deg, ${color} 0%, ${low ? "#c8155a" : "#0a4020"} 100%)`
                          : "rgba(255,255,255,.06)",
                        border: on ? `1px solid ${color}` : "1px solid rgba(255,255,255,.12)",
                        boxShadow: on
                          ? `0 0 6px ${glow}, inset 0 0 3px rgba(255,255,255,.3)`
                          : "none",
                      }}
                    />
                    {on && <DamageCounterOverlay damage={damage} compact />}
                  </button>
                </ShieldAnimationSlot>
              );
            })}
          </span>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side={previewSide}
        align="center"
        sideOffset={10}
        onMouseEnter={openPreview}
        onMouseLeave={scheduleClose}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="w-[138px] rounded-lg border border-hud-border-hot/55 bg-hud-surface-raised/95 p-3 shadow-[0_14px_34px_rgba(4,9,25,0.48)]"
        data-testid="shield-stack-preview"
      >
        <div
          aria-hidden="true"
          className="mb-2 flex items-baseline justify-between border-b border-hud-border/35 pb-1.5"
        >
          <span className="font-mono text-hud-xs font-bold uppercase tracking-normal text-hud-text-muted">
            Shield
          </span>
          <span
            className="font-display text-hud-md font-extrabold"
            style={{ color: low ? "var(--color-hud-danger)" : "var(--color-hud-accent-hot)" }}
          >
            {String(value).padStart(2, "0")}
            <span className="text-hud-xs text-hud-text-muted">/{String(max).padStart(2, "0")}</span>
          </span>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto w-[88px]"
          style={{ height: stackHeight }}
          data-shield-preview-stack
        >
          {activeShields.length === 0 ? (
            <div className="grid h-[106px] w-[76px] place-items-center rounded-md border border-dashed border-hud-border/45 font-mono text-hud-2xs font-bold uppercase tracking-hud-label text-hud-text-dim">
              Empty
            </div>
          ) : (
            activeShields.map(({ damage, index }) => (
              <div
                key={index}
                className="absolute left-1/2 top-0 transition-transform duration-200 ease-out"
                style={{
                  zIndex: activeShields.length - index,
                  transform: `translateX(-50%) translateY(${index * 30}px)`,
                }}
              >
                <CardBack width={76} height={106} />
                <DamageCounterOverlay damage={damage} compact />
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ShieldAnimationSlot({
  card,
  zoneId,
  active,
  children,
}: {
  readonly card: GameCardData | undefined;
  readonly zoneId: string | undefined;
  readonly active: boolean;
  readonly children: ReactNode;
}) {
  const separator = zoneId?.indexOf(":") ?? -1;
  const ownerId = separator >= 0 ? zoneId!.slice(separator + 1) : "";
  const entity = card
    ? gundamAnimationEntityForCard({ ...card, faceDown: true }, ownerId)
    : undefined;
  const ref = useAnimationNode(
    { kind: "entity", id: entity?.id ?? "" },
    { entity, zoneId, density: "mini", presence: "present" },
  );
  return (
    <span
      ref={entity && zoneId ? ref : undefined}
      {...(active ? { role: "listitem" } : { "aria-hidden": true })}
    >
      {children}
    </span>
  );
}
