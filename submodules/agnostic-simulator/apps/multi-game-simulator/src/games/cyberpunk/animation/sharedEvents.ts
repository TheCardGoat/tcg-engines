import type {
  AnimationPlanStepV1,
  AnimationPlanV1,
  AnimationRef,
  SimulatorAudioCueId,
} from "@tcg/protocol";
import { simulatorAnimationDebug } from "@tcg/simulator-ui";
import type { SimulatorZone } from "@tcg/simulator-contract";
import type { CardZone } from "@tcg/cyberpunk-types";

import { cyberpunkCardZoneToSimulatorZone } from "../engine/projectSimulator";
import { PLAYER_SIDE_TO_ID, type Side } from "../engine";
import type { AnimationScript, AnimationStep, EffectTargetStep } from "./types";

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
const GIG_STEAL_READABLE_DURATION_MS = 900;
const LEGEND_REVEAL_TRANSFER_DURATION_MS = 240;

export function cyberpunkAnimationScriptToAnimationPlans(
  script: AnimationScript,
  context: CyberpunkSharedAnimationContext,
): AnimationPlanV1[] {
  const effectInfo = effectTargetResolutionInfo(script);
  const stepPlans: AnimationPlanV1[] = [];
  const sourceCleanupPlans: AnimationPlanV1[] = [];

  for (const step of script.steps) {
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

  const plans = [...stepPlans, ...sourceCleanupPlans];

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
): AnimationPlanV1 | null {
  const side = resolveStepSide(step, context);
  if (!side) return null;

  const id = context.idPrefix ? `${context.idPrefix}:${step.id}` : step.id;
  const base = {
    id: step.id,
    delayMs: step.startMs + (context.delayOffsetMs ?? 0),
    durationMs: context.durationOverrideMs ?? step.durationMs,
  };

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
      return plan(id, {
        ...base,
        durationMs,
        type: "moveEntity",
        entity: entityRef(String(step.cardId)),
        from,
        to,
        audioCue: cyberpunkStepAudioCue(step),
      });
    }
    case "cardEnter": {
      if (step.reason === "cardsDrawn" && step.toZone === "hand") {
        return plan(id, {
          ...base,
          type: "moveEntity",
          entity: entityRef(String(step.cardId)),
          from: zoneRef("deck", side),
          to: zoneRef("hand", side),
          audioCue: "card.draw",
        });
      }
      return plan(id, {
        ...base,
        type: "enterEntity",
        entity: entityRef(String(step.cardId)),
        to: zoneRef(step.toZone, side),
        audioCue: cyberpunkStepAudioCue(step),
      });
    }
    case "cardExit":
      return plan(id, {
        ...base,
        type: "moveEntity",
        entity: entityRef(String(step.cardId)),
        from: zoneRef(step.fromZone, side),
        to: zoneRef(step.toZone, side),
        audioCue: cyberpunkStepAudioCue(step),
      });
    case "cardAttach":
      return plan(id, {
        ...base,
        type: "moveEntity",
        entity: entityRef(String(step.gearId)),
        from: zoneRef("hand", side),
        to: entityRef(String(step.hostId)),
        audioCue: "card.move",
      });
    case "legendReveal":
      return {
        id,
        version: 1,
        actorId: String(step.playerId),
        anchors: [],
        steps: [
          {
            ...base,
            id: `${step.id}:to-resolution`,
            durationMs: LEGEND_REVEAL_TRANSFER_DURATION_MS,
            type: "moveEntity",
            entity: entityRef(String(step.cardId)),
            from: zoneRef("legendArea", side),
            to: resolvingProgramRef(String(step.cardId)),
            label: "CALL",
            sourceFace: "hidden",
            destinationFace: "hidden",
            audioCue: "card.move",
          },
          {
            ...base,
            id: `${step.id}:flip`,
            delayMs: base.delayMs + LEGEND_REVEAL_TRANSFER_DURATION_MS,
            type: "spotlightEntity",
            entity: entityRef(String(step.cardId)),
            at: resolvingProgramRef(String(step.cardId)),
            label: "REVEAL",
            sourceFace: "hidden",
            destinationFace: "public",
            audioCue: "effect.trigger",
          },
          {
            ...base,
            id: `${step.id}:return`,
            delayMs: base.delayMs + LEGEND_REVEAL_TRANSFER_DURATION_MS + base.durationMs,
            durationMs: LEGEND_REVEAL_TRANSFER_DURATION_MS,
            type: "moveEntity",
            entity: entityRef(String(step.cardId)),
            from: resolvingProgramRef(String(step.cardId)),
            to: zoneRef("legendArea", side),
            sourceFace: "public",
            destinationFace: "public",
            audioCue: "card.move",
          },
        ],
      };
    case "effectTarget": {
      const source = effectSourceRef(step, context);
      const resultLabel = effectTargetResultLabel(step, context);
      const effectStep: AnimationPlanStepV1 = {
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
        ...(resultLabel ? { label: resultLabel } : {}),
        durationMs: step.durationMs + (context.resultHoldMs ?? 0),
        audioCue: "effect.trigger",
      };
      if (!isStagedEffectSource(step, context)) {
        return plan(id, effectStep);
      }
      return {
        id,
        version: 1,
        actorId: String(step.playerId),
        anchors: [],
        steps: [
          {
            ...base,
            id: `${step.id}:source-spotlight`,
            type: "spotlightEntity",
            entity: entityRef(String(step.sourceCardId)),
            at: source,
            label: stagedEffectSourceLabel(step, context),
            durationMs: effectStep.durationMs,
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
        label: "PLAYED",
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
        label:
          step.attackKind === "direct" && step.reason === "attackResolved" ? "IMPACT" : undefined,
        detailLabel: directAttackGigStealLabel(step),
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
        label: "BLOCK",
        audioCue: "effect.trigger",
      });
    case "gigMove": {
      const fromSide = sideForPlayerId(String(step.fromPlayerId), context);
      const toSide = sideForPlayerId(String(step.toPlayerId), context);
      if (!fromSide || !toSide) return null;
      const isGigSteal = step.reason === "gigStolen";
      return plan(id, {
        ...base,
        durationMs: isGigSteal
          ? Math.max(base.durationMs, GIG_STEAL_READABLE_DURATION_MS)
          : base.durationMs,
        type: "moveEntity",
        entity: entityRef(String(step.dieId)),
        from: gigZoneRef(step.from, fromSide),
        to: gigZoneRef(step.to, toSide),
        audioCue: isGigSteal ? "resource.steal" : "card.move",
        label: isGigSteal ? "GIG STOLEN" : undefined,
      });
    }
    case "phaseChange":
      return plan(id, {
        ...base,
        type: "phaseChange",
        from: step.from,
        to: step.to,
        ...(step.variant ? { variant: step.variant } : {}),
        ...(step.turnPlayerId
          ? { player: { kind: "player" as const, id: String(step.turnPlayerId) } }
          : {}),
        ...(step.turnNumber ? { turnNumber: step.turnNumber } : {}),
        audioCue: "phase.change",
      });
    case "resourceFloat":
      return plan(id, {
        ...base,
        type: "resourceDelta",
        player: { kind: "player", id: String(step.playerId) },
        anchor:
          step.resource === "gig" && step.dieId
            ? entityRef(String(step.dieId))
            : { kind: "anchor", id: `${side === "player" ? "p" : "opp"}-eddies` },
        delta: step.delta,
        label: step.resource.toUpperCase(),
        fromValue: step.previousValue,
        toValue: step.newValue,
        audioCue: step.delta >= 0 ? "resource.gain" : "resource.spend",
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
): AnimationPlanV1 | null {
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
    type: "moveEntity",
    entity: entityRef(String(step.sourceCardId)),
    from: resolvingProgramRef(String(step.sourceCardId)),
    to: zoneRef("trash", side),
    delayMs:
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

function stagedEffectSourceLabel(
  step: EffectTargetStep,
  context: CyberpunkSharedAnimationContext,
): string {
  return context.stagedEffectSourceLabels?.get(String(step.sourceCardId)) ?? "TRIGGER";
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

function plan(id: string, step: AnimationPlanStepV1): AnimationPlanV1 {
  return { id, version: 1, anchors: [], steps: [step] };
}

function entityRef(id: string): { kind: "entity"; id: string } {
  return { kind: "entity", id };
}

function zoneRef(zone: CardZone, side: Side): { kind: "zone"; id: string; ownerId: string } {
  return zoneRefFromSimulatorZone(cyberpunkCardZoneToSimulatorZone(zone, side));
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

function animationPlanDebugSummary(plan: AnimationPlanV1): Record<string, unknown> {
  return {
    id: plan.id,
    steps: plan.steps.map((step) => ({
      id: step.id,
      type: step.type,
      delayMs: step.delayMs,
      durationMs: step.durationMs,
    })),
  };
}

function effectTargetResultLabel(
  step: EffectTargetStep,
  context: CyberpunkSharedAnimationContext,
): "DEFEATED" | "RESOLVED" | undefined {
  const defeatedTargetIds = context.defeatedTargetIdsForStep?.(step.id);
  if (!defeatedTargetIds || defeatedTargetIds.size === 0) {
    return step.targets.some((target) => target.kind === "gig") ? undefined : "RESOLVED";
  }
  return step.targets.some(
    (target) => target.kind === "card" && defeatedTargetIds.has(String(target.cardId)),
  )
    ? "DEFEATED"
    : "RESOLVED";
}

function directAttackGigStealLabel(
  step: Extract<AnimationStep, { kind: "combat" }>,
): string | undefined {
  if (step.attackKind !== "direct" || step.reason !== "attackResolved" || !step.gigsStolen) {
    return undefined;
  }
  return `STEALS ${step.gigsStolen} ${step.gigsStolen === 1 ? "GIG" : "GIGS"}`;
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
    default:
      return sideForPlayerId(String(step.playerId), context);
  }
}

function sideForPlayerId(playerId: string, context: CyberpunkSharedAnimationContext): Side | null {
  return context.sideForPlayerId?.(playerId) ?? PLAYER_ID_TO_SIDE.get(playerId) ?? null;
}
