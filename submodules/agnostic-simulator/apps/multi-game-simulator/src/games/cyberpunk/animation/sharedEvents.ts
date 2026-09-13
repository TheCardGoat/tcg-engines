import type {
  AnimationStepV2,
  AnimationPlanV2,
  AnimationRef,
  SimulatorAudioCueId,
} from "@tcg/protocol";
import { AnimationPlanV2Schema } from "@tcg/protocol";
import { simulatorAnimationDebug } from "@tcg/simulator-ui";
import type { SimulatorZone } from "@tcg/simulator-contract";
import type { CardZone } from "@tcg/cyberpunk-types";

import { cyberpunkCardZoneToSimulatorZone } from "../engine/projectSimulator";
import {
  PLAYER_SIDE_TO_ID,
  type AnimationScript,
  type AnimationStep,
  type EffectTargetStep,
  type Side,
} from "../engine";

export interface CyberpunkSharedAnimationContext {
  viewerSeatId: string | null;
  idPrefix?: string;
  pendingEffectSourceCardId?: string | null;
  resultHoldMs?: number;
  delayOffsetMs?: number;
  durationOverrideMs?: number;
  sideForPlayerId?: (playerId: string) => Side | null;
  resolvingProgramSourceCardId?: string | null;
  stagedEffectSourceCardIds?: ReadonlySet<string>;
  stagedEffectSourceLabels?: ReadonlyMap<string, string>;
  defeatedTargetIdsForStep?: (stepId: string) => ReadonlySet<string> | undefined;
}

interface EffectTargetResolutionInfo {
  defeatedTargetIdsByStepId: ReadonlyMap<string, ReadonlySet<string>>;
  cleanupStepIds: ReadonlySet<string>;
  cleanupDelayOffsetMsByStepId: ReadonlyMap<string, number>;
}

const PLAYER_ID_TO_SIDE = new Map<string, Side>([
  [String(PLAYER_SIDE_TO_ID.player), "player"],
  [String(PLAYER_SIDE_TO_ID.opponent), "opponent"],
]);
const TARGETED_PROGRAM_CLEANUP_DURATION_MS = 420;
const EFFECT_TARGET_CLEANUP_MATCH_WINDOW_MS = 250;
const COMBAT_REDIRECT_READABLE_DURATION_MS = 900;
const LEGEND_REVEAL_TRANSFER_DURATION_MS = 240;
const CARD_REVEAL_TRANSFER_DURATION_MS = 320;
const CYBERPUNK_CARD_ZONES = new Set<CardZone>([
  "field",
  "hand",
  "deck",
  "trash",
  "legendArea",
  "gigArea",
  "eddieArea",
]);
const CYBERPUNK_GIG_ZONES = new Set(["fixerArea", "gigArea"] as const);

export function cyberpunkAnimationScriptToAnimationPlans(
  script: AnimationScript,
  context: CyberpunkSharedAnimationContext,
): AnimationPlanV2[] {
  return buildCyberpunkAnimationPlans(script, context).map((plan) =>
    AnimationPlanV2Schema.parse(plan),
  );
}

export function isCyberpunkAuthoritativeRollback(
  nextVersion: number,
  authoritativeVersion: number | null,
): boolean {
  return authoritativeVersion !== null && nextVersion < authoritativeVersion;
}

/**
 * Server plans carry engine-native zones and conservative hidden faces.
 * Normalize them at the viewer boundary where both rendered zone ids and
 * private-zone visibility are known.
 */
export function projectCyberpunkAuthoritativeAnimationPlan(
  plan: AnimationPlanV2,
  viewerSeatId: string | null,
): AnimationPlanV2 {
  return AnimationPlanV2Schema.parse({
    ...plan,
    steps: plan.steps.map((step) => {
      if (step.type !== "entityTransfer") return step;
      const source = projectCyberpunkZoneEndpoint(step.from, viewerSeatId);
      const destination = projectCyberpunkZoneEndpoint(step.to, viewerSeatId);
      return {
        ...step,
        ...(source.ref ? { from: source.ref } : { from: undefined }),
        ...(destination.ref ? { to: destination.ref } : { to: undefined }),
        sourceFace: transferSourceFace(
          source.face ?? step.sourceFace,
          destination.face ?? step.destinationFace,
        ),
        destinationFace: destination.face ?? step.destinationFace,
      };
    }),
  });
}

function projectCyberpunkZoneEndpoint(
  ref: AnimationRef | undefined,
  viewerSeatId: string | null,
): { ref: AnimationRef | undefined; face: "public" | "hidden" | null } {
  if (!ref || ref.kind !== "zone") {
    return { ref, face: null };
  }
  const side = PLAYER_ID_TO_SIDE.get(ref.ownerId ?? "");
  if (!side) return { ref, face: null };
  if (CYBERPUNK_GIG_ZONES.has(ref.id as "fixerArea" | "gigArea")) {
    return {
      ref: gigZoneRef(ref.id as "fixerArea" | "gigArea", side),
      face: "public",
    };
  }
  if (!CYBERPUNK_CARD_ZONES.has(ref.id as CardZone)) {
    return { ref, face: null };
  }
  const zone = ref.id as CardZone;
  return {
    ref: zoneRef(zone, side),
    face: viewerSafeFaceForZone(zone, side, viewerSeatId),
  };
}

function buildCyberpunkAnimationPlans(
  script: AnimationScript,
  context: CyberpunkSharedAnimationContext,
): AnimationPlanV2[] {
  const effectInfo = effectTargetResolutionInfo(script);
  const hasGainedGig = script.steps.some(
    (step) => step.kind === "gigMove" && step.moveKind === "gain",
  );
  const stepPlans: AnimationPlanV2[] = [];
  const sourceCleanupPlans: AnimationPlanV2[] = [];

  for (const step of script.steps) {
    if (hasGainedGig && step.kind === "phaseChange") {
      continue;
    }
    const cleanupStep = effectInfo.cleanupStepIds.has(step.id);
    const delayOffsetMs =
      (effectInfo.cleanupDelayOffsetMsByStepId.get(step.id) ?? 0) +
      (cleanupStep ? (context.resultHoldMs ?? 0) : 0);
    const stepContext: CyberpunkSharedAnimationContext = {
      ...context,
      delayOffsetMs,
      durationOverrideMs: cleanupStep ? TARGETED_PROGRAM_CLEANUP_DURATION_MS : undefined,
      defeatedTargetIdsForStep: (stepId) => effectInfo.defeatedTargetIdsByStepId.get(stepId),
    };
    const stepPlan = cyberpunkAnimationStepToAnimationPlan(step, stepContext);
    if (stepPlan) {
      stepPlans.push(stepPlan);
    }
    const sourceCleanupPlan = sourceProgramCleanupAnimationPlan(step, stepContext);
    if (sourceCleanupPlan) {
      sourceCleanupPlans.push(sourceCleanupPlan);
    }
  }

  const partialPlans = [...stepPlans, ...sourceCleanupPlans];
  const plans: AnimationPlanV2[] =
    partialPlans.length === 0
      ? []
      : [
          {
            id: `${context.idPrefix ?? "cyberpunk"}:transition`,
            version: 2,
            steps: partialPlans.flatMap((partialPlan) => partialPlan.steps),
          },
        ];

  simulatorAnimationDebug("cyberpunk script mapped", {
    idPrefix: context.idPrefix,
    pendingEffectSourceCardId: context.pendingEffectSourceCardId,
    resultHoldMs: context.resultHoldMs,
    cleanupStepIds: [...effectInfo.cleanupStepIds],
    steps: script.steps.map((step) => animationStepDebugSummary(step)),
    plans: plans.map((plan) => animationPlanDebugSummary(plan)),
  });
  return plans;
}

export function cyberpunkAnimationStepToAnimationPlan(
  step: AnimationStep,
  context: CyberpunkSharedAnimationContext,
): AnimationPlanV2 | null {
  const id = context.idPrefix ? `${context.idPrefix}:${step.id}` : step.id;
  const base = {
    id: step.id,
    startAtMs: step.startMs + (context.delayOffsetMs ?? 0),
    durationMs: context.durationOverrideMs ?? step.durationMs,
  };
  if (step.kind === "gameResult") {
    return plan(id, {
      ...base,
      type: "gameResult",
      outcome: step.winnerId ? "winner" : "draw",
      ...(step.winnerId ? { winner: { kind: "player" as const, id: String(step.winnerId) } } : {}),
      reasonLabel: step.reasonLabel,
    });
  }

  const side = resolveStepSide(step, context);
  if (!side) return null;

  switch (step.kind) {
    case "cardMove": {
      const from = zoneRef(step.fromZone, side);
      const to =
        context.pendingEffectSourceCardId === String(step.cardId) &&
        step.fromZone === "hand" &&
        step.toZone === "trash"
          ? resolvingProgramRef(String(step.cardId))
          : zoneRef(step.toZone, side);
      const durationMs =
        context.pendingEffectSourceCardId === String(step.cardId) &&
        step.fromZone === "hand" &&
        step.toZone === "trash"
          ? TARGETED_PROGRAM_CLEANUP_DURATION_MS
          : base.durationMs;
      const destinationFace = viewerSafeFaceForZone(step.toZone, side, context.viewerSeatId);
      return plan(id, {
        ...base,
        durationMs,
        type: "entityTransfer",
        entity: entityRef(String(step.cardId)),
        from,
        to,
        sourceFace: transferSourceFace(
          viewerSafeFaceForZone(step.fromZone, side, context.viewerSeatId),
          destinationFace,
        ),
        destinationFace,
        audioCue: cyberpunkStepAudioCue(step),
      });
    }
    case "cardEnter": {
      if (step.reason === "cardsDrawn" && step.toZone === "hand") {
        const destinationFace = viewerSafeFaceForZone("hand", side, context.viewerSeatId);
        return plan(id, {
          ...base,
          type: "entityTransfer",
          entity: entityRef(String(step.cardId)),
          from: zoneRef("deck", side),
          to: zoneRef("hand", side),
          sourceFace: transferSourceFace("hidden", destinationFace),
          destinationFace,
          audioCue: "card.draw",
        });
      }
      return plan(id, {
        ...base,
        type: "entityTransfer",
        entity: entityRef(String(step.cardId)),
        to: zoneRef(step.toZone, side),
        sourceFace: viewerSafeFaceForZone(step.toZone, side, context.viewerSeatId),
        destinationFace: viewerSafeFaceForZone(step.toZone, side, context.viewerSeatId),
        audioCue: cyberpunkStepAudioCue(step),
      });
    }
    case "cardExit": {
      const destinationFace = viewerSafeFaceForZone(step.toZone, side, context.viewerSeatId);
      return plan(id, {
        ...base,
        type: "entityTransfer",
        entity: entityRef(String(step.cardId)),
        from: zoneRef(step.fromZone, side),
        to: zoneRef(step.toZone, side),
        sourceFace: transferSourceFace(
          viewerSafeFaceForZone(step.fromZone, side, context.viewerSeatId),
          destinationFace,
        ),
        destinationFace,
        audioCue: cyberpunkStepAudioCue(step),
      });
    }
    case "cardAttach":
      return plan(id, {
        ...base,
        type: "entityTransfer",
        entity: entityRef(String(step.gearId)),
        from: zoneRef("hand", side),
        to: entityRef(String(step.hostId)),
        sourceFace: viewerSafeFaceForZone("hand", side, context.viewerSeatId),
        destinationFace: "public",
        audioCue: "card.move",
      });
    case "legendReveal":
      return {
        id,
        version: 2,
        steps: [
          {
            ...base,
            id: `${step.id}:to-resolution`,
            durationMs: LEGEND_REVEAL_TRANSFER_DURATION_MS,
            type: "entityTransfer",
            entity: entityRef(String(step.cardId)),
            from: zoneRef("legendArea", side),
            to: resolvingProgramRef(String(step.cardId)),
            sourceFace: "public",
            destinationFace: "public",
            audioCue: "card.move",
          },
          {
            ...base,
            id: `${step.id}:hold`,
            startAtMs: base.startAtMs + LEGEND_REVEAL_TRANSFER_DURATION_MS,
            type: "hold",
            durationMs: base.durationMs,
            audioCue: "effect.trigger",
          },
          {
            ...base,
            id: `${step.id}:return`,
            startAtMs: base.startAtMs + LEGEND_REVEAL_TRANSFER_DURATION_MS + base.durationMs,
            durationMs: LEGEND_REVEAL_TRANSFER_DURATION_MS,
            type: "entityTransfer",
            entity: entityRef(String(step.cardId)),
            from: resolvingProgramRef(String(step.cardId)),
            to: zoneRef("legendArea", side),
            sourceFace: "public",
            destinationFace: "public",
            audioCue: "card.move",
          },
        ],
      };
    case "cardReveal": {
      const settleSteps: AnimationStepV2[] = step.toZone
        ? [
            {
              ...base,
              id: `${step.id}:settle`,
              startAtMs: base.startAtMs + CARD_REVEAL_TRANSFER_DURATION_MS + base.durationMs,
              durationMs: CARD_REVEAL_TRANSFER_DURATION_MS,
              type: "entityTransfer",
              entity: entityRef(String(step.cardId)),
              from: resolvingProgramRef(String(step.cardId)),
              to: zoneRef(step.toZone, side),
              sourceFace: "public",
              destinationFace: "public",
              audioCue: step.toZone === "trash" ? "card.discard" : "card.move",
            },
          ]
        : [];

      return {
        id,
        version: 2,
        steps: [
          {
            ...base,
            id: `${step.id}:to-resolution`,
            durationMs: CARD_REVEAL_TRANSFER_DURATION_MS,
            type: "entityTransfer",
            entity: entityRef(String(step.cardId)),
            from: zoneRef(step.fromZone, side),
            to: resolvingProgramRef(String(step.cardId)),
            sourceFace: "public",
            destinationFace: "public",
            audioCue: "card.move",
          },
          {
            ...base,
            id: `${step.id}:hold`,
            startAtMs: base.startAtMs + CARD_REVEAL_TRANSFER_DURATION_MS,
            type: "hold",
            durationMs: base.durationMs,
            audioCue: "effect.trigger",
          },
          ...settleSteps,
        ],
      };
    }
    case "effectTarget": {
      const source = effectSourceRef(step, context);
      const effectStep: AnimationStepV2 = {
        ...base,
        type: "effect",
        source,
        targets: step.targets.map((target): AnimationRef => {
          switch (target.kind) {
            case "card":
              return entityRef(String(target.cardId));
            case "gig":
              return entityRef(String(target.dieId));
            case "player":
              return { kind: "player", id: String(target.playerId) };
          }
        }),
        durationMs: step.durationMs + (context.resultHoldMs ?? 0),
        audioCue: "effect.trigger",
      };
      if (!isStagedEffectSource(step, context)) {
        return plan(id, effectStep);
      }
      return {
        id,
        version: 2,
        steps: [
          {
            ...base,
            id: `${step.id}:source-hold`,
            type: "hold",
            durationMs: step.durationMs + (context.resultHoldMs ?? 0),
          },
          effectStep,
        ],
      };
    }
    case "cardLand":
      return plan(id, {
        ...base,
        type: "effect",
        source: entityRef(String(step.cardId)),
        targets: [entityRef(String(step.cardId))],
        audioCue: "card.play",
      });
    case "combat":
      return plan(id, {
        ...base,
        type: "combat",
        source: entityRef(String(step.attackerId)),
        target: step.defenderId ? entityRef(String(step.defenderId)) : playerTargetRef(step, side),
        reason: step.reason === "attackResolved" ? "resolved" : "declared",
        attackKind: step.attackKind,
        audioCue: step.reason === "attackResolved" ? "combat.hit" : "combat.start",
      });
    case "combatRedirect":
      return plan(id, {
        ...base,
        durationMs: Math.max(base.durationMs, COMBAT_REDIRECT_READABLE_DURATION_MS),
        type: "combat",
        source: entityRef(String(step.blockerId)),
        target: entityRef(String(step.attackerId)),
        reason: "blocked",
        attackKind: "fight",
        audioCue: "effect.trigger",
      });
    case "gigMove": {
      const fromSide = sideForPlayerId(String(step.fromPlayerId), context);
      const toSide = sideForPlayerId(String(step.toPlayerId), context);
      if (!fromSide || !toSide) return null;
      const isGigSteal = step.reason === "gigStolen";
      return plan(id, {
        ...base,
        type: "entityTransfer",
        entity: entityRef(String(step.dieId)),
        from: gigZoneRef(step.from, fromSide),
        to: gigZoneRef(step.to, toSide),
        sourceFace: "public",
        destinationFace: "public",
        audioCue: isGigSteal ? "resource.steal" : "card.move",
      });
    }
    case "phaseChange":
      return plan(id, {
        ...base,
        type: "phaseChange",
        from: step.from,
        to: step.to,
        variant: step.variant ?? "phase",
        ...(step.turnPlayerId
          ? { player: { kind: "player" as const, id: String(step.turnPlayerId) } }
          : {}),
        ...(step.turnNumber ? { turnNumber: step.turnNumber } : {}),
        audioCue: "phase.change",
      });
    case "resourceFloat":
      return plan(id, {
        ...base,
        type: "valueDelta",
        subject:
          step.resource === "gig" && step.dieId
            ? entityRef(String(step.dieId))
            : { kind: "anchor", id: `${side === "player" ? "p" : "opp"}-eddies` },
        delta: step.delta,
        fromValue: step.previousValue,
        toValue: step.newValue,
        audioCue: step.delta >= 0 ? "resource.gain" : "resource.spend",
      });
    case "entityStateChange":
      return plan(id, {
        ...base,
        type: "entityStateChange",
        entity: entityRef(String(step.cardId)),
        at: entityRef(String(step.cardId)),
        change: "orientation",
        sourceFace: "public",
        destinationFace: "public",
        fromRotationDeg: step.change === "spent" ? 0 : 90,
        toRotationDeg: step.change === "spent" ? 90 : 0,
      });
    case "randomization":
      return plan(id, {
        ...base,
        type: "randomization",
        at:
          step.randomization === "die" && step.dieId
            ? entityRef(String(step.dieId))
            : zoneRef("deck", side),
        kind: step.randomization,
        ...(step.resultLabel ? { resultLabel: step.resultLabel } : {}),
        audioCue: step.randomization === "shuffle" ? "deck.shuffle" : "effect.trigger",
      });
  }
}

function cyberpunkStepAudioCue(step: AnimationStep): SimulatorAudioCueId | undefined {
  switch (step.kind) {
    case "cardMove":
      return step.toZone === "trash" ? "card.discard" : "card.move";
    case "cardEnter":
      return step.reason === "cardsDrawn" && step.toZone === "hand" ? "card.draw" : "card.move";
    case "cardExit":
      return step.toZone === "trash" ? "card.discard" : "card.move";
    default:
      return undefined;
  }
}

function sourceProgramCleanupAnimationPlan(
  step: AnimationStep,
  context: CyberpunkSharedAnimationContext,
): AnimationPlanV2 | null {
  if (step.kind !== "effectTarget" || !isFinalResolvingProgramEffect(step, context)) {
    return null;
  }
  const side = resolveStepSide(step, context);
  if (!side) {
    return null;
  }
  const stepId = `${step.id}:source-cleanup`;
  const id = context.idPrefix ? `${context.idPrefix}:${stepId}` : stepId;
  return plan(id, {
    id: stepId,
    type: "entityTransfer",
    entity: entityRef(String(step.sourceCardId)),
    from: resolvingProgramRef(String(step.sourceCardId)),
    to: zoneRef("trash", side),
    sourceFace: "public",
    destinationFace: "public",
    startAtMs:
      step.startMs + (context.delayOffsetMs ?? 0) + step.durationMs + (context.resultHoldMs ?? 0),
    durationMs: TARGETED_PROGRAM_CLEANUP_DURATION_MS,
    audioCue: "card.discard",
  });
}

function effectSourceRef(
  step: EffectTargetStep,
  context: CyberpunkSharedAnimationContext,
): AnimationRef {
  if (isResolvingProgramEffect(step, context) || isStagedEffectSource(step, context)) {
    return resolvingProgramRef(String(step.sourceCardId));
  }
  return entityRef(String(step.sourceCardId));
}

function isStagedEffectSource(
  step: EffectTargetStep,
  context: CyberpunkSharedAnimationContext,
): boolean {
  const sourceCardId = String(step.sourceCardId);
  return (
    context.stagedEffectSourceCardIds?.has(sourceCardId) === true ||
    context.stagedEffectSourceLabels?.has(sourceCardId) === true
  );
}

function isFinalResolvingProgramEffect(
  step: EffectTargetStep,
  context: CyberpunkSharedAnimationContext,
): boolean {
  return (
    isResolvingProgramEffect(step, context) &&
    context.pendingEffectSourceCardId !== String(step.sourceCardId)
  );
}

function isResolvingProgramEffect(
  step: EffectTargetStep,
  context: CyberpunkSharedAnimationContext,
): boolean {
  return context.resolvingProgramSourceCardId === String(step.sourceCardId);
}

function resolvingProgramAnchorId(cardId: string): string {
  return `resolving-program:${cardId}`;
}

function resolvingProgramRef(cardId: string): { kind: "anchor"; id: string } {
  return { kind: "anchor", id: resolvingProgramAnchorId(cardId) };
}

export function isCyberpunkAnimationStepSharedSupported(_step: AnimationStep): boolean {
  return true;
}

function plan(id: string, step: AnimationStepV2): AnimationPlanV2 {
  return { id, version: 2, steps: [step] };
}

function entityRef(id: string): { kind: "entity"; id: string } {
  return { kind: "entity", id };
}

function zoneRef(zone: CardZone, side: Side): { kind: "zone"; id: string; ownerId: string } {
  return zoneRefFromSimulatorZone(cyberpunkCardZoneToSimulatorZone(zone, side));
}

function viewerSafeFaceForZone(
  zone: CardZone,
  side: Side,
  viewerSeatId: string | null,
): "public" | "hidden" {
  if (zone === "deck" || zone === "legendArea") return "hidden";
  if (zone !== "hand" && zone !== "eddieArea") return "public";
  return String(PLAYER_SIDE_TO_ID[side]) === viewerSeatId ? "public" : "hidden";
}

/**
 * Once a card is travelling to a public destination, its identity is already
 * visible in the destination state. Render that public face for the entire
 * transfer instead of moving a card back-side first and then flipping it.
 */
function transferSourceFace(
  sourceFace: "public" | "hidden",
  destinationFace: "public" | "hidden",
): "public" | "hidden" {
  return sourceFace === "hidden" && destinationFace === "public" ? "public" : sourceFace;
}

function zoneRefFromSimulatorZone(zone: SimulatorZone): {
  kind: "zone";
  id: string;
  ownerId: string;
} {
  return {
    kind: "zone",
    id: zone.id,
    ownerId: zone.ownerId ?? "",
  };
}

function gigZoneRef(
  zone: "fixerArea" | "gigArea",
  side: Side,
): { kind: "zone"; id: string; ownerId: string } {
  return {
    kind: "zone",
    id:
      zone === "fixerArea"
        ? side === "player"
          ? "p-fixer"
          : "opp-fixer"
        : side === "player"
          ? "p-gigArea"
          : "opp-gigArea",
    ownerId: String(PLAYER_SIDE_TO_ID[side]),
  };
}

function playerTargetRef(
  _step: Extract<AnimationStep, { kind: "combat" }>,
  fallbackSide: Side,
): AnimationRef {
  const rivalSide = fallbackSide === "player" ? "opponent" : "player";
  return { kind: "anchor", id: rivalSide === "player" ? "p-street-cred" : "opp-street-cred" };
}

function animationStepDebugSummary(step: AnimationStep): Record<string, unknown> {
  switch (step.kind) {
    case "cardMove":
      return {
        id: step.id,
        kind: step.kind,
        cardId: String(step.cardId),
        fromZone: step.fromZone,
        toZone: step.toZone,
        startMs: step.startMs,
        durationMs: step.durationMs,
      };
    case "effectTarget":
      return {
        id: step.id,
        kind: step.kind,
        sourceCardId: String(step.sourceCardId),
        targets: step.targets,
        startMs: step.startMs,
        durationMs: step.durationMs,
      };
    case "combatRedirect":
      return {
        id: step.id,
        kind: step.kind,
        attackerId: String(step.attackerId),
        blockerId: String(step.blockerId),
        originalTargetId: step.originalTargetId ? String(step.originalTargetId) : null,
        startMs: step.startMs,
        durationMs: step.durationMs,
      };
    default:
      return { id: step.id, kind: step.kind, startMs: step.startMs, durationMs: step.durationMs };
  }
}

function animationPlanDebugSummary(plan: AnimationPlanV2): Record<string, unknown> {
  return {
    id: plan.id,
    steps: plan.steps.map((step) => ({
      id: step.id,
      type: step.type,
      startAtMs: step.startAtMs,
      durationMs: step.durationMs,
    })),
  };
}

function effectTargetResolutionInfo(script: AnimationScript): EffectTargetResolutionInfo {
  const defeatedTargetIdsByStepId = new Map<string, ReadonlySet<string>>();
  const cleanupStepIds = new Set<string>();
  const cleanupDelayOffsetMsByStepId = new Map<string, number>();
  const effectSteps = script.steps.filter(
    (step): step is EffectTargetStep => step.kind === "effectTarget",
  );

  for (const effectStep of effectSteps) {
    const targetCardIds = new Set(
      effectStep.targets
        .filter((target) => target.kind === "card")
        .map((target) => String(target.cardId)),
    );
    const defeatedTargetIds = new Set<string>();
    const effectEndMs = effectStep.startMs + effectStep.durationMs;

    for (const step of script.steps) {
      const cleanupDelayOffsetMs = Math.max(0, effectEndMs - step.startMs);
      const startsInCleanupWindow =
        step.startMs >= effectStep.startMs &&
        step.startMs <= effectEndMs + EFFECT_TARGET_CLEANUP_MATCH_WINDOW_MS;
      if (step.kind === "cardExit" && targetCardIds.has(String(step.cardId))) {
        if (!startsInCleanupWindow) {
          continue;
        }
        if (step.exitReason === "defeated") {
          defeatedTargetIds.add(String(step.cardId));
        }
        cleanupStepIds.add(step.id);
        cleanupDelayOffsetMsByStepId.set(step.id, cleanupDelayOffsetMs);
      }
      if (
        step.kind === "cardMove" &&
        step.toZone === "trash" &&
        targetCardIds.has(String(step.cardId)) &&
        startsInCleanupWindow
      ) {
        cleanupStepIds.add(step.id);
        cleanupDelayOffsetMsByStepId.set(step.id, cleanupDelayOffsetMs);
      }
    }

    defeatedTargetIdsByStepId.set(effectStep.id, defeatedTargetIds);
  }

  return {
    defeatedTargetIdsByStepId,
    cleanupStepIds,
    cleanupDelayOffsetMsByStepId,
  };
}

function resolveStepSide(
  step: AnimationStep,
  context: CyberpunkSharedAnimationContext,
): Side | null {
  switch (step.kind) {
    case "gigMove":
      return sideForPlayerId(String(step.toPlayerId), context);
    case "combat":
      return sideForPlayerId(String(step.playerId), context);
    case "gameResult":
      return step.winnerId ? sideForPlayerId(String(step.winnerId), context) : null;
    default:
      return sideForPlayerId(String(step.playerId), context);
  }
}

function sideForPlayerId(playerId: string, context: CyberpunkSharedAnimationContext): Side | null {
  return context.sideForPlayerId?.(playerId) ?? PLAYER_ID_TO_SIDE.get(playerId) ?? null;
}
