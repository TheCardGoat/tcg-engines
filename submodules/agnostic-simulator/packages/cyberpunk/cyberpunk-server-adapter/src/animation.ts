import type { AnimationScript, AnimationStep } from "@tcg/cyberpunk-engine";
import {
  AnimationPlanV2Schema,
  type AnimationPlanV2,
  type AnimationRef,
  type AnimationStepV2,
} from "@tcg/protocol";

const PLAYER_SIDE_BY_ID = new Map<string, "player" | "opponent">([
  ["p1", "player"],
  ["p2", "opponent"],
]);

const CARD_ZONES = new Set([
  "field",
  "hand",
  "deck",
  "trash",
  "legendArea",
  "gigArea",
  "eddieArea",
]);
const PRIVATE_ZONES = new Set(["hand", "deck", "legendArea", "eddieArea"]);

/**
 * One script→plan transform for live and practice. Emits transfers, in-place
 * spend/ready and Call Legend face flips, Eddie/Gig value deltas, and turn
 * announcements. Overlay film (holds, resolving hops, combat, effect beams) is
 * omitted.
 */
export function cyberpunkAnimationPlan(
  id: string,
  script: AnimationScript,
): AnimationPlanV2 | null {
  const steps = script.steps.flatMap((step) => mapStep(step));
  if (steps.length === 0) return null;
  return AnimationPlanV2Schema.parse({ id, version: 2, steps });
}

/**
 * Server plans carry engine-native zones and conservative hidden faces.
 * Normalize them at the viewer boundary where rendered zone ids and
 * private-zone visibility are known.
 */
export function projectCyberpunkAuthoritativeAnimationPlan(
  plan: AnimationPlanV2,
  viewerSeatId: string | null,
): AnimationPlanV2 {
  return AnimationPlanV2Schema.parse({
    ...plan,
    steps: plan.steps.map((step) => {
      if (step.type === "entityTransfer") {
        const source = projectCyberpunkZoneEndpoint(step.from, viewerSeatId);
        const destination = projectCyberpunkZoneEndpoint(step.to, viewerSeatId);
        return {
          ...step,
          ...(source.ref ? { from: source.ref } : { from: undefined }),
          ...(destination.ref ? { to: destination.ref } : { to: undefined }),
          sourceFace:
            step.from?.kind === "zone" && step.from.id === "legendArea"
              ? step.sourceFace
              : (source.face ?? step.sourceFace),
          destinationFace:
            step.to?.kind === "zone" && step.to.id === "legendArea"
              ? step.destinationFace
              : (destination.face ?? step.destinationFace),
        };
      }
      if (step.type === "valueDelta") {
        const subject = projectCyberpunkZoneEndpoint(step.subject, viewerSeatId);
        return subject.ref ? { ...step, subject: subject.ref } : step;
      }
      if (step.type === "effect" && step.sourceExitTo) {
        const destination = projectCyberpunkZoneEndpoint(step.sourceExitTo, viewerSeatId);
        return destination.ref ? { ...step, sourceExitTo: destination.ref } : step;
      }
      return step;
    }),
  });
}

function mapStep(step: AnimationStep): AnimationStepV2[] {
  const base = {
    id: step.id,
    startAtMs: step.startMs,
    durationMs: step.durationMs,
  };
  switch (step.kind) {
    case "cardMove":
    case "cardExit": {
      const fromHostId = "fromHostId" in step ? step.fromHostId : undefined;
      const resolvingEffect = step.kind === "cardMove" && step.presentation === "resolving-effect";
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.cardId),
          from: fromHostId ? entityRef(step.cardId) : zoneRef(step.fromZone, step.playerId),
          to: resolvingEffect
            ? resolvingEffectAnchorRef(step.cardId)
            : zoneRef(step.toZone, step.playerId),
          sourceFace: fromHostId
            ? "public"
            : (("sourceFace" in step ? step.sourceFace : undefined) ?? zoneFace(step.fromZone)),
          destinationFace: resolvingEffect
            ? "public"
            : (("destinationFace" in step ? step.destinationFace : undefined) ??
              zoneFace(step.toZone)),
          audioCue: resolvingEffect
            ? "card.play"
            : step.toZone === "trash"
              ? "card.discard"
              : "card.move",
        },
      ];
    }
    case "cardEnter":
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.cardId),
          from: zoneRef("deck", step.playerId),
          to: zoneRef(step.toZone, step.playerId),
          sourceFace: zoneFace("deck"),
          destinationFace: zoneFace(step.toZone),
          audioCue:
            step.reason === "cardsDrawn" && step.toZone === "hand" ? "card.draw" : "card.move",
        },
      ];
    case "cardAttach":
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.gearId),
          from: zoneRef("hand", step.playerId),
          to: entityRef(step.hostId),
          sourceFace: zoneFace("hand"),
          destinationFace: "public",
          // The host stays mounted while the gear clone flies onto it; only the
          // gear's own hand slot is suppressed behind the flying clone.
          destinationPresentation: "overlay",
          audioCue: "card.move",
        },
      ];
    case "cardReveal": {
      if (!step.toZone) return [];
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.cardId),
          from: zoneRef(step.fromZone, step.playerId),
          to: zoneRef(step.toZone, step.playerId),
          sourceFace: zoneFace(step.fromZone),
          destinationFace: step.toZone === "hand" ? zoneFace("hand") : "public",
          audioCue: step.toZone === "trash" ? "card.discard" : "card.move",
        },
      ];
    }
    case "legendReveal":
      return [
        {
          ...base,
          type: "entityStateChange",
          entity: entityRef(step.cardId),
          at: entityRef(step.cardId),
          change: "face",
          sourceFace: "hidden",
          destinationFace: "public",
          ...(step.fromRotationDeg !== undefined ? { fromRotationDeg: step.fromRotationDeg } : {}),
          ...(step.toRotationDeg !== undefined ? { toRotationDeg: step.toRotationDeg } : {}),
          audioCue: "card.reveal",
        },
      ];
    case "gigMove":
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.dieId),
          from: gigZoneRef(step.from, step.fromPlayerId),
          to: gigZoneRef(step.to, step.toPlayerId),
          sourceFace: "public",
          destinationFace: "public",
          audioCue: step.moveKind === "steal" ? "resource.steal" : "resource.gain",
        },
      ];
    case "phaseChange":
      if (step.variant !== "turn") return [];
      return [
        {
          ...base,
          type: "phaseChange",
          from: step.from,
          to: step.to,
          variant: "turn",
          ...(step.turnPlayerId
            ? { player: { kind: "player" as const, id: String(step.turnPlayerId) } }
            : {}),
          ...(step.turnNumber ? { turnNumber: step.turnNumber } : {}),
          audioCue: "turn.change",
        },
      ];
    case "entityStateChange":
      return [
        {
          ...base,
          type: "entityStateChange",
          entity: entityRef(step.cardId),
          at: entityRef(step.cardId),
          change: "orientation",
          sourceFace: "public",
          destinationFace: "public",
          fromRotationDeg: step.change === "spent" ? 0 : 90,
          toRotationDeg: step.change === "spent" ? 90 : 0,
          audioCue: step.change === "spent" ? "resource.spend" : "card.move",
        },
      ];
    case "resourceFloat":
      if (step.resource === "gig") {
        if (!step.dieId) return [];
        return [
          {
            ...base,
            type: "valueDelta",
            subject: entityRef(step.dieId),
            delta: step.delta,
            label: "GIG",
            ...(step.previousValue !== undefined ? { fromValue: step.previousValue } : {}),
            ...(step.newValue !== undefined ? { toValue: step.newValue } : {}),
            audioCue: step.delta < 0 ? "resource.spend" : "resource.gain",
          },
        ];
      }
      return [
        {
          ...base,
          type: "valueDelta",
          subject: zoneRef("eddieArea", step.playerId),
          delta: step.delta,
          label: "EDDIES",
          audioCue: step.delta < 0 ? "resource.spend" : "resource.gain",
        },
      ];
    case "effectTarget":
      return [
        {
          ...base,
          type: "effect",
          source: entityRef(step.sourceCardId),
          targets: step.targets.map(effectTargetRef),
          ...(step.label ? { label: step.label } : {}),
          ...(step.tone ? { tone: step.tone } : {}),
          ...(step.presentation
            ? { presentation: step.presentation, sourceFace: "public" as const }
            : {}),
          ...(step.sourceExit
            ? { sourceExitTo: zoneRef(step.sourceExit.zone, step.sourceExit.playerId) }
            : {}),
          audioCue: "effect.trigger",
        },
      ];
    case "cardLand":
    case "combat":
    case "combatRedirect":
    case "randomization":
    case "gameResult":
      return [];
  }
}

function projectCyberpunkZoneEndpoint(
  ref: AnimationRef | undefined,
  viewerSeatId: string | null,
): { ref: AnimationRef | undefined; face: "public" | "hidden" | null } {
  if (!ref || ref.kind !== "zone") {
    return { ref, face: null };
  }
  const side = PLAYER_SIDE_BY_ID.get(ref.ownerId ?? "");
  if (!side) return { ref, face: null };
  if (ref.id === "fixerArea") {
    return {
      ref: {
        kind: "zone",
        id: side === "player" ? "p-fixer" : "opp-fixer",
        ownerId: ref.ownerId ?? "",
      },
      face: "public",
    };
  }
  if (!CARD_ZONES.has(ref.id)) {
    return { ref, face: null };
  }
  const zone = ref.id;
  const prefix = side === "player" ? "p" : "opp";
  const renderedId =
    zone === "eddieArea"
      ? `${prefix}-eddieArea`
      : zone === "gigArea"
        ? `${prefix}-gigArea`
        : `${prefix}-${zone}`;
  return {
    ref: { kind: "zone", id: renderedId, ownerId: ref.ownerId ?? "" },
    face: viewerSafeFace(zone, side, viewerSeatId),
  };
}

function viewerSafeFace(
  zone: string,
  side: "player" | "opponent",
  viewerSeatId: string | null,
): "public" | "hidden" {
  if (zone === "deck" || zone === "legendArea") return "hidden";
  if (zone !== "hand" && zone !== "eddieArea") return "public";
  return (side === "player" ? "p1" : "p2") === viewerSeatId ? "public" : "hidden";
}

function zoneFace(zone: string): "public" | "hidden" {
  return PRIVATE_ZONES.has(zone) ? "hidden" : "public";
}

function entityRef(id: string): { kind: "entity"; id: string } {
  return { kind: "entity", id: String(id) };
}

function resolvingEffectAnchorRef(id: string): { kind: "anchor"; id: string } {
  return { kind: "anchor", id: `resolving-program:${String(id)}` };
}

function effectTargetRef(
  target: Extract<AnimationStep, { kind: "effectTarget" }>["targets"][number],
): AnimationRef {
  switch (target.kind) {
    case "card":
      return entityRef(target.cardId);
    case "gig":
      return entityRef(target.dieId);
    case "player":
      return { kind: "player", id: String(target.playerId) };
  }
}

function zoneRef(zone: string, playerId: string): { kind: "zone"; id: string; ownerId: string } {
  return { kind: "zone", id: zone, ownerId: String(playerId) };
}

function gigZoneRef(
  zone: "fixerArea" | "gigArea",
  playerId: string,
): { kind: "zone"; id: string; ownerId: string } {
  return { kind: "zone", id: zone, ownerId: String(playerId) };
}
