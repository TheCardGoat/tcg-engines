import { useEffect, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

import { useCardLegality } from "../../../game/index.ts";
import {
  CardFace as SimulatorCardFace,
  ViewerSafeCardImage,
  useTargeting,
} from "@tcg/simulator-ui";
import { useHasHover } from "../../../lib/use-has-hover.ts";
import type { CardColor, GameCardData, TargetingState } from "../types.ts";
import { CardTagStrip } from "./CardTagStrip.tsx";
import { getCardTags } from "./card-tags.ts";
import { StatCurrentBadges } from "./StatCurrentBadges.tsx";
import { useDualMode } from "../dual-mode-context.tsx";
import { useLinkTargetPreview } from "../link-target-preview-context.tsx";
import { DualModeOverlay } from "./DualModeOverlay.tsx";
import { DamageCounterOverlay } from "./DamageCounterOverlay.tsx";
import { toSimulatorEntity } from "./to-simulator-entity.ts";

export const CARD_COLORS: Record<CardColor, string> = {
  blue: "#1e49c7",
  green: "#2ea65a",
  red: "#d7263d",
  white: "#e8ecf1",
  purple: "#7b4182",
};

const TARGET_CANDIDATE_SHADOW =
  "0 0 0 3px rgba(255,248,170,1), 0 0 0 7px rgba(255,190,35,.78), 0 0 28px rgba(255,214,64,1), 0 0 62px rgba(255,150,20,.72), 0 0 96px rgba(255,105,0,.4)";
const TARGET_LINK_SHADOW =
  "0 0 0 3px rgba(244,255,251,1), 0 0 0 8px rgba(52,235,166,.92), 0 7px 30px rgba(20,190,130,.82), 0 0 68px rgba(80,255,200,.74)";
const TARGET_SELECTED_SHADOW =
  "0 0 0 3px rgba(255,255,255,1), 0 0 0 7px rgba(45,107,255,1), 0 0 30px rgba(45,107,255,1), 0 0 68px rgba(76,195,255,.9), 0 0 104px rgba(76,195,255,.48)";

const CANONICAL_WIDTH = 734;

export interface CardFaceProps {
  readonly card: GameCardData;
  readonly width: number;
  readonly height: number;
  readonly useContainerSize?: boolean;
  readonly style?: CSSProperties;
  readonly onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** The owning zone handles the native drag lifecycle. This flag keeps
   * the card face's cursor and visual affordance aligned with that wrapper. */
  readonly draggable?: boolean;
  /** When true, suppress the top-right stat stack. Used by play-zone
   * bands that render the stat pills externally. */
  readonly hideStatBadges?: boolean;
  /** When true, suppress the bottom tag strip. Same rationale — the
   * play-zone band hosts the tag chips above the card. */
  readonly hideSupplementalBadges?: boolean;
  /** Loading strategy for the card art. Board/hand cards stay lazy; the
   * hover preview passes "eager" so the art starts fetching on hover. */
  readonly imageLoading?: "eager" | "lazy";
  /** Notified when the card art finishes loading or fails. Lets the hover
   * preview swap its text fallback for the loaded image. */
  readonly onImageStatusChange?: (status: "loaded" | "error") => void;
}

export function CardFace({
  card,
  width,
  height,
  useContainerSize = false,
  style,
  onClick,
  draggable = false,
  hideStatBadges = false,
  hideSupplementalBadges = false,
  imageLoading = "lazy",
  onImageStatusChange,
}: CardFaceProps) {
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Touch devices synthesize mouseenter/leave on tap. Skip the hover
  // lift transform and "invalid target" tint on touch so they don't
  // trigger from the same tap that fires the click handler.
  const hasHover = useHasHover();
  // If `hasHover` flips false after a synthetic mouseenter already set
  // local `hovered` to true, the matching mouseleave never fires (its
  // handler is detached) and the lift/tint stay stuck. Clear it.
  useEffect(() => {
    if (!hasHover) setHovered(false);
  }, [hasHover]);
  const tint = (card.color && CARD_COLORS[card.color]) || "#7b4182";
  const scale = Math.max(width / CANONICAL_WIDTH, 0.35);
  const chamfer = Math.max(3, Math.round(6 * scale));
  const simulatorEntity = toSimulatorEntity(card);
  const resolvedImageSrc = simulatorEntity.imageUrl;
  const hasImage = Boolean(resolvedImageSrc) && !imageError;
  const tags = getCardTags(card);
  const damage = card.damage ?? 0;

  useEffect(() => {
    setImageError(false);
  }, [resolvedImageSrc]);

  // Per-card targeting feedback. During an `enterBattle` target-selection
  // step, a card that isn't in the candidate set is an "invalid" target —
  // dim it and redshift the border while the user hovers it. The
  // screen-wide `SpotlightDim` still conveys the active state globally;
  // this adds a specific cue on the card the user is actually pointing at.
  const targeting = useTargeting();
  const linkPreview = useLinkTargetPreview();
  const isCandidate =
    targeting.active && card.id != null ? targeting.candidateIds.has(card.id) : false;
  const isLinkCandidate =
    isCandidate && card.id != null ? linkPreview.linkCandidateIds.has(card.id) : false;
  const isInvalidTarget = targeting.active && !isCandidate && hovered;
  const targetingState: TargetingState | undefined = isInvalidTarget
    ? "invalid"
    : isLinkCandidate
      ? "link-candidate"
      : isCandidate
        ? "candidate"
        : undefined;

  // Tri-state legality from the shared protocol interaction view.
  // Replaces the boolean `card.playable` for visual treatment so a
  // viewer-controlled card that isn't accepted by any current move is
  // explicitly marked `disabled` (desaturated + not-allowed cursor)
  // instead of just looking inert. `card.playable` is left in place as
  // a back-compat fallback for renders without an id (e.g. ghost cards
  // in setup overlays) until that prop is dropped in the cleanup pass.
  const legality = useCardLegality(card.id);
  const isPlayable =
    !targeting.active && (legality === "playable" || (card.id == null && card.playable === true));
  const isDisabled = legality === "disabled";

  // A zone-provided `draggable` flag is already derived from the same
  // interaction view as `isPlayable`; trust it directly so the cursor
  // cannot lag behind the native wrapper during a projection update.
  const isDraggable = draggable || (isPlayable && Boolean(onClick));

  // Dual-mode lifted state (rule 3-4-6): when this card has been
  // tapped and BOTH command-effect and pair-as-pilot moves are legal,
  // the user picks a half. The provider owns the pending-move
  // plumbing — we just call `dual.commit(mode)` from each half.
  const dual = useDualMode();
  const isDualLifted = dual.pending?.cardId != null && dual.pending.cardId === card.id;

  const sizingStyle = useContainerSize
    ? {
        width: `var(--zone-card-width, ${width}px)`,
        height: `var(--zone-card-height, ${height}px)`,
      }
    : { width, height };
  const auraShadow = isInvalidTarget
    ? "0 0 0 3px rgba(255,77,94,.85), 0 5px 18px rgba(255,45,122,.48)"
    : card.selected
      ? TARGET_SELECTED_SHADOW
      : isLinkCandidate
        ? TARGET_LINK_SHADOW
        : isCandidate
          ? TARGET_CANDIDATE_SHADOW
          : card.highlight
            ? "0 0 10px rgba(76,195,255,.75)"
            : isPlayable
              ? "0 0 0 2px rgba(240,255,244,1), 0 0 0 5px rgba(40,210,92,.95), 0 5px 18px rgba(18,170,70,.72), 0 0 34px rgba(86,220,120,.62)"
              : "0 2px 5px rgba(0,0,0,.55)";
  const auraOutline =
    card.selected && !isInvalidTarget
      ? "1px solid rgba(45,107,255,.6)"
      : isCandidate
        ? "1px solid rgba(255,255,255,.72)"
        : "none";
  const auraClassName = `gd-card-aura${isLinkCandidate && !card.selected ? " gd-target-link" : ""}${
    isCandidate && !isLinkCandidate && !card.selected ? " gd-target-candidate" : ""
  }${card.selected && !isInvalidTarget ? " gd-target-selected" : ""}`;
  const stateClassName = `${
    isPlayable && !card.selected && !isCandidate ? " gd-card-actionable" : ""
  }${
    isLinkCandidate && !card.selected ? " gd-target-link" : ""
  }${isCandidate && !isLinkCandidate && !card.selected ? " gd-target-candidate" : ""}${
    card.selected && !isInvalidTarget ? " gd-target-selected" : ""
  }`;

  if (simulatorEntity.face === "hidden") {
    return (
      <div style={{ ...sizingStyle, ...style }}>
        <SimulatorCardFace
          entity={simulatorEntity}
          density="normal"
          fill
          fullImageChrome="edge-to-edge"
          fullImageFit="contain"
        />
      </div>
    );
  }

  return (
    <div
      className="gd-card-shell relative flex-shrink-0 overflow-visible"
      style={{
        ...sizingStyle,
        transform:
          isPlayable && hovered
            ? card.exerted
              ? "rotate(20deg) scale(.96) translateY(-4px)"
              : "translateY(-4px)"
            : card.exerted
              ? "rotate(20deg) scale(.96)"
              : "none",
        transformOrigin: "center center",
        ...style,
      }}
    >
      <span
        className={auraClassName}
        data-card-aura
        aria-hidden="true"
        style={{
          boxShadow: auraShadow,
          outline: auraOutline,
          outlineOffset: card.selected || isCandidate ? 2 : 0,
        }}
      />
      <div
        aria-label={cardAriaLabel(card, simulatorEntity.states, isPlayable, isLinkCandidate)}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.currentTarget.click();
              }
            : undefined
        }
        onMouseEnter={hasHover ? () => setHovered(true) : undefined}
        onMouseLeave={hasHover ? () => setHovered(false) : undefined}
        data-card-id={card.id}
        data-entity-id={card.id}
        data-sim-entity-id={card.id}
        data-card-type={card.cardType}
        data-targeting-state={targetingState}
        data-legality={legality}
        data-actionable={isPlayable ? "true" : undefined}
        className={`gd-card-visual relative z-[1] h-full w-full bg-hud-deep overflow-hidden transition-[border-color,filter] duration-200${stateClassName}`}
        style={{
          ...sizingStyle,
          border: `${isPlayable || isCandidate || card.selected ? 3 : 1}px solid ${
            isInvalidTarget
              ? "#ff4d5e"
              : card.selected
                ? "#ffffff"
                : isLinkCandidate
                  ? "#86ffd1"
                  : isCandidate
                    ? "#ffe36e"
                    : isPlayable
                      ? "rgba(120,235,140,.95)"
                      : shade(tint, -35)
          }`,
          filter: isInvalidTarget ? "saturate(0.4) brightness(0.8)" : undefined,
          cursor: isCandidate
            ? "pointer"
            : isDisabled
              ? "not-allowed"
              : isDraggable
                ? "grab"
                : onClick
                  ? "pointer"
                  : "default",
          clipPath: `polygon(${chamfer}px 0, 100% 0, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, 0 100%, 0 ${chamfer}px)`,
        }}
      >
        {isPlayable && !card.selected && !isCandidate && (
          <span className="gd-card-action-marker" aria-hidden="true" />
        )}
        <ArtFallback color={card.color} name={card.name} scale={scale} />
        {hasImage && (
          <div className="absolute inset-0">
            <ViewerSafeCardImage
              entity={simulatorEntity}
              alt={card.name}
              loading={imageLoading}
              // Never crop a card face: shell/image ratios may differ while
              // cached CDN assets are rolling out, but the full printed card
              // (including its rules text and corners) must remain visible.
              className="absolute inset-0 h-full w-full object-contain"
              style={{ objectFit: "contain" }}
              onImageLoad={() => {
                onImageStatusChange?.("loaded");
              }}
              onImageError={() => {
                setImageError(true);
                onImageStatusChange?.("error");
              }}
            />
          </div>
        )}

        {card.cardType === "unit" &&
          card.deployedThisTurn === true &&
          card.canAttackThisTurn === false && <DeployedOverlay chamfer={chamfer} />}

        {/* Legality lock overlay removed — the static legality glow ring
         * (rendered via boxShadow/border above) is sufficient signal without
         * dimming or locking the non-playable cards. */}

        <DamageCounterOverlay damage={damage} scale={scale} />

        {!hideStatBadges && scale >= 0.6 && (
          <StatCurrentBadges
            ap={card.ap}
            baseAp={card.baseAp}
            hp={card.hp}
            baseHp={card.baseHp}
            scale={scale}
          />
        )}

        {!hideSupplementalBadges && tags.length > 0 && scale >= 0.45 && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: 3 * scale,
              right: 3 * scale,
              bottom: 3 * scale,
              zIndex: 2,
            }}
          >
            <CardTagStrip
              tags={tags}
              maxVisible={scale < 0.55 ? 1 : scale < 0.75 ? 2 : 3}
              compact={scale < 0.55}
              collapseMode={scale < 0.85 ? "hover-stack" : "none"}
            />
          </div>
        )}

        {isDualLifted && (
          <DualModeOverlay
            scale={scale}
            onPickCmd={() => dual.commit("cmd")}
            onPickPilot={() => dual.commit("pilot")}
          />
        )}
      </div>
      {isLinkCandidate && !card.selected && (
        <span className="gd-link-target-marker" data-testid="link-target-marker">
          <span className="gd-link-target-marker__diamond" aria-hidden="true" />
          LINK
        </span>
      )}
    </div>
  );
}

function cardAriaLabel(
  card: GameCardData,
  states: readonly string[],
  isPlayable: boolean,
  isLinkCandidate: boolean,
): string {
  const parts = [card.name];
  if (isPlayable) parts.push("action available");
  if (isLinkCandidate) parts.push("Link Condition met");
  if (card.cardType) parts.push(card.cardType);
  if (card.color) parts.push(card.color);
  if (card.ap != null) parts.push(`AP ${card.ap}`);
  if (card.hp != null) parts.push(`HP ${card.hp}`);
  const readiness = states.find((state) => state === "ready" || state === "rested");
  if (readiness) parts.push(readiness);
  if (card.keywords?.length) {
    parts.push(
      ...card.keywords.map((entry) =>
        entry.value == null ? entry.keyword : `${entry.keyword} ${entry.value}`,
      ),
    );
  }
  if (card.traits?.length) parts.push(...card.traits);
  if (card.battlefieldZones?.length) {
    parts.push(
      card.battlefieldZones.map((zone) => zone[0]!.toUpperCase() + zone.slice(1)).join(" / "),
    );
  }
  return parts.join(", ");
}

function ArtFallback({
  color,
  name,
  scale,
}: {
  readonly color?: CardColor;
  readonly name: string;
  readonly scale: number;
}) {
  const tint = (color && CARD_COLORS[color]) || "#7b4182";
  const fs = Math.max(scale, 0.55);
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${shade(tint, 25)}, ${shade(tint, -15)} 60%, ${shade(tint, -40)})`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,.28),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,.35),transparent_60%)]" />
      <div
        className="absolute inset-x-1 top-1/2 -translate-y-1/2 text-center font-display font-extrabold text-white/85 uppercase leading-tight"
        style={{
          fontSize: Math.max(7, 9 * fs),
          textShadow: "0 1px 2px rgba(0,0,0,.8)",
          letterSpacing: ".04em",
          overflowWrap: "anywhere",
        }}
      >
        {name}
      </div>
    </div>
  );
}

/**
 * Full-card diagonal-stripe overlay that flags a unit as "cannot attack
 * this turn" per rule 3-2-4 (non-Link units deployed this turn). Link
 * units are exempt (rule 3-2-6-3) — the caller gates on
 * `canAttackThisTurn === false` so Link units never reach here.
 *
 * zIndex sits below damage (3) and stat badges (4) so the overlay is
 * never the thing hiding load-bearing numbers.
 */
function DeployedOverlay({ chamfer }: { readonly chamfer: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      data-testid="deployed-overlay"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(45,107,255,.18) 0 6px, rgba(0,0,0,0) 6px 14px)",
        clipPath: `polygon(${chamfer}px 0, 100% 0, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, 0 100%, 0 ${chamfer}px)`,
        zIndex: 2,
      }}
    />
  );
}

function shade(hex: string, pct: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + pct * 2));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + pct * 2));
  const b = Math.max(0, Math.min(255, (n & 255) + pct * 2));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
