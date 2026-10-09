import { ANIMATION_DURATIONS_MS } from "@tcg/cyberpunk-engine";
import {
  animationSpeedScale,
  type AnimationPhase,
  type AnimationSpeed,
  type CompiledAnimationPlan,
} from "@tcg/simulator-runtime/animation";
import type { SimulatorDeckReveal } from "@tcg/simulator-contract";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

import { CardImage } from "../components/GameBoard/CardImage";
import { usePendingDeckRevealForSide } from "../components/GameBoard/deckReveal";
import { useEngine, type Side } from "../engine";
import { type DeckRevealActor, type DeckRevealSourceInfo } from "../engine/deckRevealProjection";
import classes from "./CyberpunkDeckRevealMotion.module.css";

interface RevealCue {
  readonly id: string;
  readonly cards: SimulatorDeckReveal["cards"];
  readonly visibility: SimulatorDeckReveal["visibility"];
  readonly side: Side;
  readonly cardTimings: readonly { startAtMs: number; durationMs: number }[];
  readonly offsetX?: number;
  readonly source?: DeckRevealSourceInfo;
  readonly actor?: DeckRevealActor;
}

interface ActiveReveal extends RevealCue {
  /** One-way flight time between the deck and the display spot, speed-scaled. */
  readonly flyMs: number;
  /** When every revealed card starts flying back to the deck together. */
  readonly returnDelayMs: number;
  /** Deck-zone box as an offset from the viewport center, when measurable. */
  readonly origin: { x: number; y: number; width: number; height: number } | null;
}

const SIDES: readonly Side[] = ["player", "opponent"];
const PAIRED_CUE_OFFSET_PX = 90;
/** Fly-out and fly-back legs; the hold between them is ANIMATION_DURATIONS_MS.cardReveal. */
const REVEAL_FLY_MS = 360;

function revealCardWidth(): number {
  return Math.min(150, Math.max(92, window.innerWidth * 0.24));
}

function cueOffset(side: Side, paired: boolean, otherCue: ActiveReveal | null): number {
  if (!paired) return 0;
  const direction = side === "player" ? -1 : 1;
  if (otherCue?.offsetX === 0) {
    // A second cue can arrive after the first is already centered. Move only
    // the new cue; changing the first cue's offset would make its card jump.
    const cardWidth = revealCardWidth();
    const availableOffset = (window.innerWidth - cardWidth) / 2 - 8;
    return direction * Math.min(cardWidth + 12, availableOffset);
  }
  return direction * PAIRED_CUE_OFFSET_PX;
}

/** Resting offsets from the display-spot center so cards sit side by side. */
function slotOffsets(count: number): readonly number[] {
  const cardWidth = revealCardWidth();
  const spread = window.innerWidth * 0.9 - cardWidth;
  const gap = Math.min(cardWidth + 12, spread / Math.max(1, count - 1));
  return Array.from({ length: count }, (_, index) => (index - (count - 1) / 2) * gap);
}

/**
 * The reveal plays out of the deck: each card flies from the deck zone to the
 * display spot at its plan timing, stays visible for the standard resolve
 * hold, then every card flies back to the deck together.
 */
function revealSchedule(
  cardTimings: readonly { startAtMs: number; durationMs: number }[],
  speed: AnimationSpeed,
): { flyMs: number; returnDelayMs: number } {
  const scale = animationSpeedScale(speed);
  const flyMs = REVEAL_FLY_MS * scale;
  const lastStart = Math.max(0, ...cardTimings.map((timing) => timing.startAtMs));
  const lastStepEnd = Math.max(
    0,
    ...cardTimings.map((timing) => timing.startAtMs + timing.durationMs),
  );
  return {
    flyMs,
    // A longer plan stretch keeps the cards up; otherwise the last card still
    // gets its full cardReveal hold before the synchronized return.
    returnDelayMs: Math.max(
      lastStart + flyMs + ANIMATION_DURATIONS_MS.cardReveal * scale,
      lastStepEnd,
    ),
  };
}

/** Deck-zone box relative to the viewport center; null when unmeasurable. */
function deckOrigin(side: Side): { x: number; y: number; width: number; height: number } | null {
  if (typeof document === "undefined") return null;
  const zoneId = side === "opponent" ? "opp-deck" : "p-deck";
  const rect = document.querySelector(`[data-sim-zone-id="${zoneId}"]`)?.getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) return null;
  return {
    x: rect.left + rect.width / 2 - window.innerWidth / 2,
    y: rect.top + rect.height / 2 - window.innerHeight / 2,
    width: rect.width,
    height: rect.height,
  };
}

function revealSourceFromStep(step: {
  sourceCardId?: string;
  sourceTitle?: string;
  sourceImageUrl?: string;
}): DeckRevealSourceInfo | undefined {
  if (!step.sourceTitle) return undefined;
  return {
    title: step.sourceTitle,
    ...(step.sourceImageUrl ? { imageUrl: step.sourceImageUrl } : {}),
  };
}

/**
 * Perspective-explicit caption: names who is acting, not just whose deck is
 * involved. To a bystander, "Your Rival is looking at the top 5 cards of
 * their own deck" says what is happening; "Looking at the top 5 cards of the
 * Rival's deck" does not say who is doing the looking.
 */
function revealCaptionLine(input: {
  countLabel: string;
  deckSide: Side;
  actor: Side | undefined;
  humanSide: Side;
  revealed: boolean;
}): string {
  const deck = input.deckSide === input.humanSide ? "your deck" : "the Rival's deck";
  if (input.actor !== undefined && input.actor !== input.humanSide) {
    if (input.deckSide === input.actor) {
      return input.revealed
        ? `Your Rival reveals the top ${input.countLabel} of their own deck`
        : `Your Rival is looking at the top ${input.countLabel} of their own deck`;
    }
    return input.revealed
      ? `Your Rival reveals the top ${input.countLabel} of YOUR deck`
      : `Your Rival is looking at the top ${input.countLabel} of YOUR deck`;
  }
  if (input.actor !== undefined) {
    return input.revealed
      ? `You reveal the top ${input.countLabel} of ${deck}`
      : `You are looking at the top ${input.countLabel} of ${deck}`;
  }
  return input.revealed
    ? `Revealed the top ${input.countLabel} of ${deck}`
    : `Looking at the top ${input.countLabel} of ${deck}`;
}

function matchesProjectedReveal(planCue: RevealCue, projection: SimulatorDeckReveal): boolean {
  return (
    projection.cards.length === planCue.cards.length &&
    projection.cards.length > 0 &&
    projection.cards.every((card, index) => card.entityId === planCue.cards[index]?.entityId)
  );
}

export function deckRevealCuesFromPlan(plan: CompiledAnimationPlan | null): RevealCue[] {
  if (!plan) return [];
  const steps = plan.steps.flatMap(({ step, startAtMs, durationMs }) => {
    // Physical transfers already animate the revealed card from the deck to
    // their destination. Only deck reveals without a destination need this
    // separate display cue.
    if (step.type !== "emphasize" || step.at.kind !== "zone" || !step.reveal) return [];
    const zone = step.at.id;
    if (zone !== "p-deck" && zone !== "opp-deck") return [];
    return [
      {
        zone,
        reveal: step.reveal,
        id: step.id,
        startAtMs,
        durationMs,
        source: revealSourceFromStep(step),
        actorSide: step.actorSide,
      },
    ];
  });
  return SIDES.flatMap((side) => {
    const zoneId = side === "player" ? "p-deck" : "opp-deck";
    const sameDeckSteps = steps.filter((step) => step.zone === zoneId);
    const first = sameDeckSteps[0];
    if (!first) return [];
    return [
      {
        id: `plan:${plan.id}:${side}`,
        cards: sameDeckSteps.map((step) =>
          step.reveal.kind === "card"
            ? {
                entityId: step.reveal.cardId,
                title: step.reveal.title ?? "Revealed card",
                imageUrl: step.reveal.imageUrl,
              }
            : { entityId: step.id, title: "Revealed card" },
        ),
        visibility: "public" as const,
        side,
        cardTimings: sameDeckSteps.map(({ startAtMs, durationMs }) => ({ startAtMs, durationMs })),
        source: sameDeckSteps.map((step) => step.source).find((source) => source !== undefined),
        actor: sameDeckSteps.map((step) => step.actorSide).find((side) => side !== undefined),
      },
    ];
  });
}

export function CyberpunkDeckRevealMotion({
  plan,
  phase,
  speed,
}: {
  plan: CompiledAnimationPlan | null;
  phase: AnimationPhase | null;
  speed: AnimationSpeed;
}) {
  const { humanSide } = useEngine();
  const playerReveal = usePendingDeckRevealForSide("player");
  const opponentReveal = usePendingDeckRevealForSide("opponent");
  const [active, setActive] = useState<Record<Side, ActiveReveal | null>>({
    player: null,
    opponent: null,
  });
  const activeRef = useRef<Record<Side, ActiveReveal | null>>({ player: null, opponent: null });
  const seenIds = useRef(new Set<string>());
  const clearTimer = useRef<Record<Side, number | null>>({ player: null, opponent: null });

  useEffect(
    () => () => {
      for (const side of SIDES) {
        if (clearTimer.current[side] !== null) window.clearTimeout(clearTimer.current[side]);
      }
    },
    [],
  );

  useEffect(() => {
    if (speed === "off") {
      if (playerReveal) seenIds.current.add(playerReveal.id);
      if (opponentReveal) seenIds.current.add(opponentReveal.id);
      for (const cue of deckRevealCuesFromPlan(plan)) seenIds.current.add(cue.id);
      for (const side of SIDES) {
        if (clearTimer.current[side] !== null) window.clearTimeout(clearTimer.current[side]);
        clearTimer.current[side] = null;
        activeRef.current[side] = null;
      }
      setActive({ player: null, opponent: null });
      return;
    }
    // A finished plan must not cut its own reveal: the cards are still flying
    // back to the deck. Only a different active transition supersedes the cue.
    for (const side of SIDES) {
      const activeCue = activeRef.current[side];
      const activePlanCueId = plan ? `plan:${plan.id}:${side}` : null;
      if (activeCue?.id.startsWith("plan:") && phase !== null && activeCue.id !== activePlanCueId) {
        if (clearTimer.current[side] !== null) window.clearTimeout(clearTimer.current[side]);
        clearTimer.current[side] = null;
        activeRef.current[side] = null;
        setActive((previous) => ({ ...previous, [side]: null }));
      }
    }
    const planCues = phase === "running" ? deckRevealCuesFromPlan(plan) : [];
    const pairedCues = SIDES.every((side) => {
      const currentProjection = side === "player" ? playerReveal : opponentReveal;
      const planCue = planCues.find((cue) => cue.side === side);
      return (
        activeRef.current[side] !== null ||
        (planCue !== undefined && !seenIds.current.has(planCue.id)) ||
        (planCue === undefined &&
          currentProjection !== undefined &&
          !seenIds.current.has(currentProjection.id))
      );
    });
    for (const side of SIDES) {
      const currentProjection = side === "player" ? playerReveal : opponentReveal;
      const planCue = planCues.find((cue) => cue.side === side);
      if (planCue && currentProjection && matchesProjectedReveal(planCue, currentProjection)) {
        if (seenIds.current.has(currentProjection.id)) seenIds.current.add(planCue.id);
        else seenIds.current.add(currentProjection.id);
      }
      // A pending choice can appear before its animation plan starts. Keep the
      // projected cue for idle states; an active transition must use its plan
      // timing so the reveal does not overlap the card play that caused it.
      const projected =
        phase === null && currentProjection && !seenIds.current.has(currentProjection.id)
          ? {
              id: currentProjection.id,
              cards: currentProjection.cards,
              visibility: currentProjection.visibility,
              side,
              ...(currentProjection.source ? { source: currentProjection.source } : {}),
              ...(currentProjection.actor ? { actor: currentProjection.actor } : {}),
              cardTimings: Array.from({ length: currentProjection.count }, (_, index) => ({
                startAtMs:
                  index * ANIMATION_DURATIONS_MS.drawStaggerMs * animationSpeedScale(speed),
                durationMs: ANIMATION_DURATIONS_MS.cardReveal * animationSpeedScale(speed),
              })),
            }
          : null;
      const nextReveal =
        planCue && !seenIds.current.has(planCue.id) ? planCue : !planCue ? projected : null;
      if (!nextReveal) continue;
      seenIds.current.add(nextReveal.id);
      if (planCue) seenIds.current.add(planCue.id);
      const reveal: ActiveReveal = {
        ...nextReveal,
        ...revealSchedule(nextReveal.cardTimings, speed),
        origin: deckOrigin(side),
        offsetX: cueOffset(
          side,
          pairedCues,
          activeRef.current[side === "player" ? "opponent" : "player"],
        ),
      };
      activeRef.current[side] = reveal;
      setActive((previous) => ({ ...previous, [side]: reveal }));
      if (clearTimer.current[side] !== null) window.clearTimeout(clearTimer.current[side]);
      clearTimer.current[side] = window.setTimeout(
        () => {
          clearTimer.current[side] = null;
          activeRef.current[side] = null;
          setActive((previous) => ({ ...previous, [side]: null }));
        },
        reveal.returnDelayMs + reveal.flyMs + 80,
      );
    }
  }, [playerReveal, opponentReveal, plan, phase, speed]);

  const visibleSides = SIDES.filter((side) => active[side] !== null);
  if (visibleSides.length === 0 || typeof document === "undefined") return null;
  const scrimOutDelay = Math.min(...visibleSides.map((side) => active[side]!.returnDelayMs));
  return createPortal(
    <div
      className={classes.stage}
      data-deck-reveal-motion={visibleSides.join(",")}
      style={{ "--scrim-out-delay": `${scrimOutDelay}ms` } as CSSProperties}
      aria-hidden="true"
    >
      {visibleSides.map((side) => {
        const reveal = active[side]!;
        if (!reveal.origin) return null;
        return (
          <div
            key={`glow:${reveal.id}`}
            className={classes.deckGlow}
            data-owner-side={side}
            style={
              {
                "--deck-x": `${reveal.origin.x}px`,
                "--deck-y": `${reveal.origin.y}px`,
                "--deck-w": `${reveal.origin.width}px`,
                "--deck-h": `${reveal.origin.height}px`,
                "--fly-ms": `${reveal.flyMs}ms`,
                "--return-delay": `${reveal.returnDelayMs}ms`,
              } as CSSProperties
            }
          />
        );
      })}
      {visibleSides.flatMap((side) => {
        const reveal = active[side]!;
        const visibleCards = reveal.visibility === "public" ? reveal.cards : [];
        const slots = slotOffsets(reveal.cardTimings.length);
        const count = reveal.cardTimings.length;
        const countLabel = `${count} card${count === 1 ? "" : "s"}`;
        const captionLine = revealCaptionLine({
          countLabel,
          deckSide: side,
          actor: reveal.actor,
          humanSide,
          revealed: visibleCards.length > 0,
        });
        const rivalActing = reveal.actor !== undefined && reveal.actor !== humanSide;
        const timingStyle = {
          "--caption-x": `${reveal.offsetX ?? 0}px`,
          "--fly-in-delay": `${reveal.cardTimings[0]?.startAtMs ?? 0}ms`,
          "--return-delay": `${reveal.returnDelayMs}ms`,
          "--fly-ms": `${reveal.flyMs}ms`,
        } as CSSProperties;
        return [
          <div
            key={`caption:${reveal.id}`}
            className={classes.caption}
            data-owner-side={side}
            data-actor-side={reveal.actor}
            data-reveal-private={visibleCards.length === 0 || undefined}
            style={timingStyle}
          >
            {reveal.source?.imageUrl ? (
              <img className={classes.captionArt} src={reveal.source.imageUrl} alt="" />
            ) : null}
            <span className={classes.captionBody}>
              {reveal.source?.title ? (
                <strong className={classes.captionSource}>{reveal.source.title}</strong>
              ) : null}
              <span className={classes.captionLine}>{captionLine}</span>
            </span>
          </div>,
          // The bystander only ever sees backs for a private look; say so
          // right under the cards instead of leaving unexplained card backs.
          ...(visibleCards.length === 0
            ? [
                <div
                  key={`private:${reveal.id}`}
                  className={classes.privateBadge}
                  data-owner-side={side}
                  data-private-badge=""
                  style={timingStyle}
                >
                  <svg className={classes.privateBadgeIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 3l18 18" />
                    <path d="M10.7 5.1c.4-.1.9-.1 1.3-.1 5 0 9 4.4 10 7-.4 1-1.2 2.2-2.3 3.3M6.1 6.1C3.9 7.7 2.6 9.9 2 12c1 2.6 5 7 10 7 1.9 0 3.6-.5 5-1.4" />
                    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                  </svg>
                  <span>{rivalActing ? "Private — your Rival is choosing" : "Private"}</span>
                </div>,
              ]
            : []),
          ...reveal.cardTimings.map((timing, index) => {
            const card = visibleCards[index] ?? null;
            const slotX = (reveal.offsetX ?? 0) + (slots[index] ?? 0);
            return (
              <div
                className={classes.card}
                key={`${reveal.id}:${index}`}
                data-deck-reveal-side={side}
                style={
                  {
                    "--from-x": reveal.origin ? `${reveal.origin.x - slotX}px` : "0px",
                    "--from-y": reveal.origin
                      ? `${reveal.origin.y}px`
                      : side === humanSide
                        ? "35dvh"
                        : "-35dvh",
                    "--slot-x": `${slotX}px`,
                    "--fly-in-delay": `${timing.startAtMs}ms`,
                    "--return-delay": `${reveal.returnDelayMs}ms`,
                    "--fly-ms": `${reveal.flyMs}ms`,
                  } as CSSProperties
                }
              >
                <CardImage
                  imageUrl={card?.imageUrl}
                  faceDown={!card?.imageUrl}
                  alt={card?.title ?? "Revealed card"}
                  disablePreview
                />
              </div>
            );
          }),
        ];
      })}
    </div>,
    document.body,
  );
}
