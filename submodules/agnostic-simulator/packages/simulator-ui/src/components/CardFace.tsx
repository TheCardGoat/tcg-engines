import type { SimulatorEntity } from "@tcg/simulator-contract";
import { forwardRef, memo, useCallback } from "react";

import { cx } from "../class-names";
import { CardImage } from "./CardImage";

const FULL_IMAGE_CARD_WIDTH: Record<NonNullable<CardFaceProps["density"]>, number> = {
  mini: 60,
  compact: 96,
  normal: 112,
  large: 136,
  full: 180,
};

export interface CardFaceProps {
  entity: SimulatorEntity;
  density?: "mini" | "compact" | "normal" | "large" | "full";
  fill?: boolean;
  selected?: boolean;
  draggable?: boolean;
  targetable?: boolean;
  illegal?: boolean;
  highlighted?: boolean;
  dimmed?: boolean;
  tabIndex?: number;
  onClick?: (entity: SimulatorEntity) => void;
  onDblClick?: (entity: SimulatorEntity) => void;
  onContextMenu?: (entity: SimulatorEntity, event: React.MouseEvent) => void;
  onDragStart?: (entity: SimulatorEntity, event: React.DragEvent) => void;
  onDragEnd?: (entity: SimulatorEntity, event: React.DragEvent) => void;
  onHoverEnter?: (entity: SimulatorEntity) => void;
  onHoverLeave?: (entity: SimulatorEntity) => void;
}

export const CardFace = memo(
  forwardRef<HTMLButtonElement, CardFaceProps>(function CardFace(
    {
      entity,
      density = "normal",
      fill = false,
      selected = false,
      draggable = false,
      targetable = false,
      illegal = false,
      highlighted = false,
      dimmed = false,
      tabIndex = -1,
      onClick,
      onDblClick,
      onContextMenu,
      onDragStart,
      onDragEnd,
      onHoverEnter,
      onHoverLeave,
    },
    ref,
  ) {
    const isHidden = entity.face === "hidden";
    const title = isHidden ? "Hidden card" : entity.title;
    const displayKind = isHidden ? "card" : entity.kind;
    const subtitle = isHidden ? "Private information" : `${entity.subtitle} | ${displayKind}`;
    const ariaLabel = isHidden ? "Hidden card" : `${title}, ${displayKind}, ${entity.ownerId}`;
    const frameColor = isHidden ? undefined : entity.frameStyle?.color;
    const cardImageUrl = isHidden ? entity.backImageUrl : entity.imageUrl;
    const usesFullCardImage = Boolean(cardImageUrl);
    const visibleOverlayBadges = isHidden ? [] : (entity.overlayBadges ?? []);
    const visibleStates = isHidden ? [] : entity.states;
    const visibleStats = isHidden ? [] : entity.stats;
    const visibleTraits = isHidden ? [] : entity.traits;

    const cardClass = cx(
      "sim-card-face relative grid select-none rounded-md border bg-[var(--card-bg)] text-[var(--board-text)] transition-colors",
      density === "mini" && "min-h-[86px] w-[60px] gap-1 p-1",
      density === "compact" && "min-h-[118px] flex-[0_1_138px] gap-2 p-2",
      density === "normal" && "min-h-[138px] flex-[0_1_156px] gap-2 p-2.5",
      density === "large" && "min-h-[174px] flex-[0_1_176px] gap-2 p-3",
      density === "full" && "min-h-[240px] flex-[0_1_240px] gap-2.5 p-3.5",
      displayKind === "leader" || displayKind === "unit"
        ? "border-[var(--game-accent)]"
        : "border-[var(--card-border)]",
      (displayKind === "die" || displayKind === "resource" || displayKind === "token") &&
        "bg-[var(--pill-bg)]",
      selected &&
        "is-selected border-[var(--game-accent)] shadow-[0_0_0_2px_color-mix(in_srgb,var(--game-accent)_22%,transparent)]",
      draggable && "cursor-grab active:cursor-grabbing",
      targetable && "cursor-crosshair ring-2 ring-[var(--game-accent)]/40",
      illegal && "opacity-40 grayscale",
      highlighted && "ring-2 ring-yellow-400/70 shadow-lg shadow-yellow-400/20",
      dimmed && "opacity-50",
      usesFullCardImage && "overflow-hidden",
    );

    const artClass = cx(
      "sim-card-art relative overflow-hidden rounded-[5px]",
      density === "mini" && "min-h-[28px]",
      density === "compact" && "min-h-[42px]",
      density === "normal" && "min-h-[54px]",
      density === "large" && "min-h-[72px]",
      density === "full" && "min-h-[110px]",
    );

    const handleClick = useCallback(() => onClick?.(entity), [entity, onClick]);
    const handleDblClick = useCallback(() => onDblClick?.(entity), [entity, onDblClick]);
    const handleContextMenu = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        onContextMenu?.(entity, e);
      },
      [entity, onContextMenu],
    );
    const handleDragStart = useCallback(
      (e: React.DragEvent) => {
        if (!draggable) {
          e.preventDefault();
          return;
        }
        e.dataTransfer?.setData("text/plain", entity.id);
        e.dataTransfer?.setData("application/json", JSON.stringify({ entityId: entity.id }));
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        onDragStart?.(entity, e);
      },
      [entity, draggable, onDragStart],
    );
    const handleDragEnd = useCallback(
      (e: React.DragEvent) => onDragEnd?.(entity, e),
      [entity, onDragEnd],
    );
    const handleMouseEnter = useCallback(() => onHoverEnter?.(entity), [entity, onHoverEnter]);
    const handleMouseLeave = useCallback(() => onHoverLeave?.(entity), [entity, onHoverLeave]);

    return (
      <button
        ref={ref}
        type="button"
        className={cardClass}
        data-card-density={density}
        data-card-kind={displayKind}
        data-card-id={entity.id}
        id={`entity-${entity.id}`}
        data-entity-id={entity.id}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        draggable={draggable}
        onClick={handleClick}
        onDoubleClick={handleDblClick}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          usesFullCardImage
            ? {
                aspectRatio: "5 / 7",
                borderColor: frameColor,
                justifySelf: fill ? undefined : "start",
                maxWidth: "100%",
                minHeight: 0,
                padding: 0,
                width: fill ? "100%" : FULL_IMAGE_CARD_WIDTH[density],
              }
            : frameColor
              ? { borderColor: frameColor }
              : undefined
        }
      >
        {usesFullCardImage ? (
          <div className="absolute inset-0" aria-hidden="true">
            <CardImage
              src={cardImageUrl!}
              alt={title}
              fill
              fit="contain"
              className="absolute inset-0 rounded-[5px] bg-black"
              loading="eager"
            />
            {visibleOverlayBadges.length > 0 &&
              visibleOverlayBadges.map((badge) => (
                <span
                  key={badge.label + badge.position}
                  aria-label={badge.label}
                  className={cx(
                    "absolute inline-flex min-h-[18px] items-center rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none text-white shadow-sm",
                    badge.position === "tl" && "left-1 top-1",
                    badge.position === "tr" && "right-1 top-1",
                    badge.position === "bl" && "bottom-1 left-1",
                    badge.position === "br" && "bottom-1 right-1",
                  )}
                  data-overlay-badge-label={badge.label}
                  data-testid="card-overlay-badge"
                  style={badge.color ? { backgroundColor: badge.color } : undefined}
                >
                  {badge.label}
                </span>
              ))}
          </div>
        ) : (
          <div className={artClass} aria-hidden="true">
            {isHidden ? (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg,var(--card-art-a),var(--card-art-a)_6px,var(--card-art-b)_6px,var(--card-art-b)_12px)",
                  }}
                />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--board-muted)]/60">
                    Hidden
                  </span>
                </div>
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg,var(--card-art-a),var(--card-art-b)_52%,var(--card-art-c))",
                }}
              />
            )}

            {visibleOverlayBadges.length > 0 &&
              visibleOverlayBadges.map((badge) => (
                <span
                  key={badge.label + badge.position}
                  aria-label={badge.label}
                  className={cx(
                    "absolute inline-flex min-h-[18px] items-center rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none text-white shadow-sm",
                    badge.position === "tl" && "left-1 top-1",
                    badge.position === "tr" && "right-1 top-1",
                    badge.position === "bl" && "bottom-1 left-1",
                    badge.position === "br" && "bottom-1 right-1",
                  )}
                  data-overlay-badge-label={badge.label}
                  data-testid="card-overlay-badge"
                  style={badge.color ? { backgroundColor: badge.color } : undefined}
                >
                  {badge.label}
                </span>
              ))}
          </div>
        )}

        {!usesFullCardImage &&
          (density !== "mini" ? (
            <div className="sim-card-header grid items-start gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-bold leading-tight text-[var(--board-muted)]">
                  {subtitle}
                </p>
                <h4 className="mt-1 text-sm font-black leading-tight text-[var(--board-text)]">
                  {title}
                </h4>
              </div>
              <span className="entity-kind inline-flex min-h-6 items-center self-start rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-black uppercase leading-none text-[var(--pill-text)]">
                {displayKind}
              </span>
            </div>
          ) : (
            <div className="min-w-0">
              <h4 className="truncate text-[10px] font-black leading-tight text-[var(--board-text)]">
                {title}
              </h4>
            </div>
          ))}

        {!usesFullCardImage && visibleStates.length > 0 && density !== "mini" && (
          <div className="entity-states flex flex-wrap gap-1">
            {visibleStates.map((state, index) => (
              <span
                key={`${state}:${index}`}
                className="entity-state inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
              >
                {state}
              </span>
            ))}
          </div>
        )}

        {!usesFullCardImage && visibleStats.length > 0 && density !== "mini" && (
          <div className="entity-stats grid grid-cols-[repeat(auto-fit,minmax(68px,1fr))] gap-1.5">
            {visibleStats.map((stat, index) => (
              <span
                key={`${stat.label}:${stat.value}:${index}`}
                className="entity-stat inline-grid min-w-16 gap-0.5 rounded-md border border-[var(--board-border)] bg-[var(--board-surface)] px-2 py-1.5"
              >
                <span className="text-[11px] font-extrabold uppercase leading-none text-[var(--board-muted)]">
                  {stat.label}
                </span>
                <strong className="text-sm leading-none text-[var(--board-text)]">
                  {stat.value}
                </strong>
              </span>
            ))}
          </div>
        )}

        {!usesFullCardImage &&
          visibleTraits.length > 0 &&
          density !== "mini" &&
          density !== "compact" && (
            <div className="entity-traits flex flex-wrap gap-1">
              {visibleTraits.map((trait, index) => (
                <span
                  key={`${trait}:${index}`}
                  className="entity-trait inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}
      </button>
    );
  }),
);

CardFace.displayName = "CardFace";
