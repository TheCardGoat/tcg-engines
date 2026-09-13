import {
  consecutiveAnimationStaggerMs,
  type AnimationAnchorRef,
  type AnimationEntityRef,
  type AnimationZoneRef,
  type AnimationRef,
  type AnimationPlanV2,
  type AnimationStepV2,
  type SimulatorAudioCueId,
} from "@tcg/protocol";
import type { FilteredMatchView, PacketAnimation } from "@tcg/gundam-engine";

export interface GundamAnimationView {
  readonly zones: Pick<FilteredMatchView["zones"], "zones">;
  readonly players: readonly Pick<FilteredMatchView["players"][number], "playerId">[];
}
export type GundamAnimationRecord =
  | { readonly animation: PacketAnimation; readonly plan?: never }
  | { readonly plan: AnimationPlanV2; readonly animation?: never };

export const GUNDAM_COMMAND_FOCUS_ANCHOR_ID = "gundam-command-focus";
export const GUNDAM_ANIMATION_DURATION_MS = {
  layout: 200,
  transfer: 800,
  stateChange: 450,
  combat: 1400,
  commandEntry: 800,
  commandEffect: 1400,
  commandCleanup: 800,
  effectHold: 1400,
  readingPause: 350,
  stagger: 120,
  maxStagger: 600,
} as const;

function findCardByInstanceId(view: GundamAnimationView, id: string) {
  for (const zone of Object.values(view.zones.zones)) {
    const card = zone.cards.find((card) => card.instanceId === id);
    if (card) return card;
  }
  return null;
}

export function gundamPacketAnimationToAnimationPlans(
  entry: GundamAnimationRecord,
  view: GundamAnimationView,
  viewerSeatId: string | null,
): AnimationPlanV2[] {
  if (entry.plan) return [projectGundamAuthoritativeAnimationPlan(entry.plan, viewerSeatId)];
  if (!entry.animation) return [];
  const { animation } = entry;
  const { data } = animation;

  if (data.kind === "cardMove") {
    const { cardId, fromZone, toZone } = data;
    if (
      baseZoneId(fromZone) === "removalArea" &&
      baseZoneId(toZone) === "trash" &&
      isCommandCard(view, cardId)
    ) {
      return [];
    }
    const ownerId = data.ownerId ?? ownerIdForCard(cardId, view, viewerSeatId ?? "");
    const renderedFromZone =
      fromZone ||
      (baseZoneId(toZone) === "resourceArea"
        ? "resourceDeck"
        : inferPublicCardMoveSourceZone(cardId, toZone, view));
    const fromRef = renderedFromZone ? gundamZoneRef(renderedFromZone, ownerId) : undefined;
    const toRef = gundamZoneRef(toZone, ownerId);
    const plans = [
      animationPlan(animation.id, {
        id: `${animation.id}:transfer`,
        type: "entityTransfer",
        entity: entityRef(cardId),
        ...(fromRef ? { from: fromRef } : {}),
        to: toRef,
        sourceFace: gundamFaceForZone(renderedFromZone, ownerId, viewerSeatId),
        destinationFace: gundamFaceForZone(toZone, ownerId, viewerSeatId),
        audioCue: gundamCardMoveAudioCue(fromZone, toZone),
      }),
    ];
    if (baseZoneId(toZone) === "resourceArea") {
      plans.push(
        animationPlan(`${animation.id}:resource-gain`, {
          id: `${animation.id}:resource-gain:step`,
          type: "valueDelta",
          subject: { kind: "anchor", id: `resourceArea:${ownerId}` },
          delta: 1,
          label: "RES",
          startAtMs: 120,
          audioCue: "resource.gain",
        }),
      );
    }
    return plans;
  }

  if (data.kind === "cardFlip") {
    return [
      animationPlan(`${animation.id}:flip`, {
        id: `${animation.id}:flip:step`,
        type: "entityStateChange",
        entity: entityRef(data.cardId),
        at: entityRef(data.cardId),
        change: "face",
        sourceFace: data.faceDown ? "public" : "hidden",
        destinationFace: data.faceDown ? "hidden" : "public",
      }),
    ];
  }

  if (data.kind === "damage") {
    if (!data.sourceId) return [];
    return [
      animationPlan(`${animation.id}:resolved`, {
        id: `${animation.id}:resolved:step`,
        type: "combat",
        source: entityRef(data.sourceId),
        target: entityRef(data.targetId),
        reason: "resolved",
        attackKind: data.attackKind ?? combatAttackKindForTarget(data.targetId, view),
        detailLabel: `${data.amount} DMG`,
        audioCue: "combat.hit",
      }),
    ];
  }

  if (data.kind !== "generic") return [];
  const { name, params } = data;

  if (name === "attackDeclared") {
    const attackerId = stringParam(params, "attackerId");
    const targetId = stringParam(params, "targetId");
    const playerId = stringParam(params, "playerId");
    if (!attackerId || !targetId || !playerId) return [];
    const target =
      targetId === "direct"
        ? gundamZoneRef("baseSection", opponentOf(view, playerId) ?? playerId)
        : entityRef(targetId);
    return [
      animationPlan(`${animation.id}:declared`, {
        id: `${animation.id}:declared:step`,
        type: "combat",
        source: entityRef(attackerId),
        target,
        reason: "declared",
        attackKind: targetId === "direct" ? "direct" : "fight",
        label: "ATTACK",
        audioCue: "combat.start",
      }),
    ];
  }

  if (name === "blockDeclared") {
    const blockerId = stringParam(params, "blockerId");
    const attackerId = stringParam(params, "attackerId");
    if (!blockerId || !attackerId) return [];
    return [
      animationPlan(`${animation.id}:declared`, {
        id: `${animation.id}:declared:step`,
        type: "combat",
        source: entityRef(blockerId),
        target: entityRef(attackerId),
        reason: "blocked",
        attackKind: "fight",
        label: "REDIRECTED",
        audioCue: "combat.start",
      }),
    ];
  }

  if (name === "commandPlayed") {
    const cardId = stringParam(params, "cardId");
    const ownerId = stringParam(params, "ownerId");
    if (!cardId || !ownerId) return [];
    const entryPlan = animationPlan(`${animation.id}:command:entry:${cardId}`, {
      id: `${animation.id}:command:entry:step`,
      type: "entityTransfer",
      entity: entityRef(cardId),
      from: gundamZoneRef("hand", ownerId),
      to: commandFocusRef(),
      sourceFace: gundamFaceForZone("hand", ownerId, viewerSeatId),
      destinationFace: "public",
      durationMs: GUNDAM_ANIMATION_DURATION_MS.commandEntry,
      audioCue: "card.play",
    });
    return params.awaitsResolution === true
      ? [entryPlan]
      : [
          entryPlan,
          commandResolutionPlan(
            `${animation.id}:command:auto`,
            cardId,
            ownerId,
            GUNDAM_ANIMATION_DURATION_MS.commandEntry,
          ),
        ];
  }

  if (name === "effectResolved") {
    const sourceCardId = stringParam(params, "sourceCardId");
    const playerId = stringParam(params, "playerId");
    if (!sourceCardId || !playerId) return [];
    const targets = stringArrayParam(params, "targets").map(entityRef);
    if (isCommandCard(view, sourceCardId)) {
      return [
        commandResolutionPlan(
          `${animation.id}:command:resolved`,
          sourceCardId,
          ownerIdForCard(sourceCardId, view, playerId),
          0,
          targets,
          baseZoneId(findCardByInstanceId(view, sourceCardId)?.zoneId) !== "removalArea",
        ),
      ];
    }
    const source = entityRef(sourceCardId);
    return [
      animationPlan(`${animation.id}:effect`, {
        id: `${animation.id}:effect:step`,
        ...(targets.length > 0
          ? {
              type: "effect" as const,
              source,
              targets,
              label: "EFFECT",
              durationMs: GUNDAM_ANIMATION_DURATION_MS.effectHold,
            }
          : {
              type: "emphasize" as const,
              at: source,
              style: "spotlight" as const,
              label: "EFFECT",
              durationMs: GUNDAM_ANIMATION_DURATION_MS.effectHold,
            }),
        audioCue: "effect.trigger",
      }),
    ];
  }

  if (name === "resourcesSpent") {
    const playerId = stringParam(params, "playerId");
    const amount = numberParam(params, "amount");
    if (!playerId || amount === null) return [];
    return [
      animationPlan(`${animation.id}:resource-spent`, {
        id: `${animation.id}:resource-spent:step`,
        type: "valueDelta",
        subject: { kind: "anchor", id: `resourceArea:${playerId}` },
        delta: -amount,
        label: "RES",
        audioCue: "resource.spend",
      }),
    ];
  }

  if (name === "hpRecovered") {
    const cardId = stringParam(params, "cardId");
    const amount = numberParam(params, "amount");
    if (!cardId || amount === null) return [];
    const card = entityRef(cardId);
    return [
      {
        id: `${animation.id}:recovery`,
        version: 2,
        steps: [
          {
            id: `${animation.id}:recovery:spotlight`,
            type: "emphasize",
            at: card,
            style: "spotlight",
            label: "RECOVER",
            durationMs: GUNDAM_ANIMATION_DURATION_MS.effectHold,
            audioCue: "effect.trigger",
          },
          {
            id: `${animation.id}:recovery:hp`,
            type: "valueDelta",
            subject: card,
            delta: amount,
            label: "HP",
            tone: "positive",
            startAtMs: 100,
            durationMs: GUNDAM_ANIMATION_DURATION_MS.effectHold,
          },
        ],
      },
    ];
  }

  if (name === "statModified") {
    const cardId = stringParam(params, "cardId");
    const stat = stringParam(params, "stat");
    const amount = numberParam(params, "amount");
    if (!cardId || !stat || amount === null) return [];
    return [
      animationPlan(`${animation.id}:stat-modified`, {
        id: `${animation.id}:stat-modified:step`,
        type: "valueDelta",
        subject: entityRef(cardId),
        delta: amount,
        label: stat.toUpperCase(),
        tone: amount < 0 ? "negative" : "positive",
        audioCue: "effect.trigger",
      }),
    ];
  }

  if (name === "cardStateChanged") {
    const cardId = stringParam(params, "cardId");
    const state = stringParam(params, "state");
    if (!cardId || (state !== "ready" && state !== "rested")) return [];
    return [
      animationPlan(`${animation.id}:state`, {
        id: `${animation.id}:state:step`,
        type: "entityStateChange",
        entity: entityRef(cardId),
        at: entityRef(cardId),
        change: "orientation",
        sourceFace: "public",
        destinationFace: "public",
        fromRotationDeg: state === "rested" ? 0 : 20,
        toRotationDeg: state === "rested" ? 20 : 0,
        durationMs: GUNDAM_ANIMATION_DURATION_MS.stateChange,
      }),
    ];
  }

  if (name === "turnChanged") {
    const previousTurn = numberParam(params, "previousTurn");
    const turn = numberParam(params, "turn");
    const playerId = stringParam(params, "playerId");
    if (previousTurn === null || turn === null || !playerId) return [];
    // Turn 1 is assigned before setup decisions finish. The top HUD already
    // reflects it, while a center-screen announcement would cover mulligan.
    if (previousTurn < 1) return [];
    return [projectedTurnAnimationPlan(previousTurn, { number: turn, playerId })];
  }

  if (name === "phaseChanged") {
    const from = stringParam(params, "from");
    const to = stringParam(params, "to");
    if (!from || !to) return [];
    // Battle progress and setup decisions already have persistent, actionable
    // surfaces. A full-screen phase banner competes with the attacker/target
    // or obscures the first-player and mulligan choices at the exact moment
    // the player needs to read them.
    if (
      from.includes("battle-phase") ||
      to.includes("battle-phase") ||
      setupDecisionPhase(from) ||
      setupDecisionPhase(to)
    ) {
      return [];
    }
    return [
      animationPlan(`${animation.id}:phase`, {
        id: `${animation.id}:phase:step`,
        type: "phaseChange",
        from,
        to,
        variant: "phase",
        audioCue: "phase.change",
      }),
    ];
  }

  return [];
}

function setupDecisionPhase(phase: string): boolean {
  return phase.includes("choose-first-player") || phase.includes("mulligan");
}

function inferPublicCardMoveSourceZone(
  cardId: string,
  toZone: string,
  view: GundamAnimationView,
): "battleArea" | "baseSection" | undefined {
  if (baseZoneId(toZone) !== "trash") return undefined;
  switch (findCardByInstanceId(view, cardId)?.definition?.type) {
    case "unit":
      return "battleArea";
    case "base":
      return "baseSection";
    default:
      return undefined;
  }
}

export function projectGundamAuthoritativeAnimationPlan(
  plan: AnimationPlanV2,
  viewerSeatId: string | null,
): AnimationPlanV2 {
  return {
    ...plan,
    steps: plan.steps.map((step) => {
      if (step.type !== "entityTransfer") return step;
      const fromOwner = step.from?.kind === "zone" ? step.from.ownerId : undefined;
      const toOwner = step.to?.kind === "zone" ? step.to.ownerId : undefined;
      return {
        ...step,
        sourceFace:
          step.from?.kind === "zone" && fromOwner
            ? gundamFaceForZone(step.from.id, fromOwner, viewerSeatId)
            : step.sourceFace,
        destinationFace:
          step.to?.kind === "zone" && toOwner
            ? gundamFaceForZone(step.to.id, toOwner, viewerSeatId)
            : step.destinationFace,
      };
    }),
  };
}

function combatAttackKindForTarget(
  targetId: string,
  view: GundamAnimationView,
): "direct" | "fight" {
  const zoneId = baseZoneId(findCardByInstanceId(view, targetId)?.zoneId);
  return zoneId === "shieldArea" || zoneId === "baseSection" ? "direct" : "fight";
}

function baseZoneId(zoneId: string | undefined): string | undefined {
  return zoneId?.split(":")[0];
}

const DEFAULT_COMBAT_PRESENTATION_DURATION_MS = GUNDAM_ANIMATION_DURATION_MS.combat;
type GundamCombatAnimationStep = Extract<AnimationStepV2, { readonly type: "combat" }>;

/**
 * The persistent combat-intent route owns attack and Blocker declarations.
 * Shared combat steps are reserved for resolved damage, and defeated-card
 * transfers wait until that damage pulse has finished.
 */
export function prepareGundamSharedAnimationSteps(
  steps: readonly AnimationStepV2[],
): AnimationStepV2[] {
  const timedSteps = steps
    .filter((step) => !step.id.endsWith(":reading-pause"))
    .map<AnimationStepV2>((step) => ({
      ...step,
      durationMs:
        step.type === "entityTransfer"
          ? GUNDAM_ANIMATION_DURATION_MS.transfer
          : step.type === "entityStateChange"
            ? GUNDAM_ANIMATION_DURATION_MS.stateChange
            : step.type === "hold"
              ? step.durationMs
              : GUNDAM_ANIMATION_DURATION_MS.effectHold,
    }));
  const singleOwnerSteps = staggerGundamCardTransfers(timedSteps).map((step): AnimationStepV2 => {
    if (step.type !== "combat" || (step.reason !== "declared" && step.reason !== "blocked")) {
      return step;
    }
    return {
      id: step.id,
      type: "hold",
      durationMs: step.durationMs ?? DEFAULT_COMBAT_PRESENTATION_DURATION_MS,
      ...(step.startAtMs === undefined ? {} : { startAtMs: step.startAtMs }),
      ...(step.audioCue === undefined ? {} : { audioCue: step.audioCue }),
    };
  });
  const resolvedCombatSteps = singleOwnerSteps.filter(
    (step): step is GundamCombatAnimationStep =>
      step.type === "combat" && step.reason === "resolved",
  );
  if (resolvedCombatSteps.length === 0) return withReadingPause(singleOwnerSteps);

  const combatEntityIds = new Set(
    resolvedCombatSteps.flatMap((step) => [
      ...(step.source.kind === "entity" ? [step.source.id] : []),
      ...(step.target.kind === "entity" ? [step.target.id] : []),
    ]),
  );
  const resolutionEndMs = resolvedCombatSteps.reduce(
    (latest, step) =>
      Math.max(
        latest,
        (step.startAtMs ?? 0) + (step.durationMs ?? DEFAULT_COMBAT_PRESENTATION_DURATION_MS),
      ),
    0,
  );

  return withReadingPause(
    singleOwnerSteps.map((step) =>
      step.type === "entityTransfer" && combatEntityIds.has(step.entity.id)
        ? {
            ...step,
            startAtMs:
              (step.startAtMs ?? 0) >= resolutionEndMs + GUNDAM_ANIMATION_DURATION_MS.readingPause
                ? step.startAtMs
                : resolutionEndMs +
                  GUNDAM_ANIMATION_DURATION_MS.readingPause +
                  (step.startAtMs ?? 0),
          }
        : step,
    ),
  );
}

function withReadingPause(steps: readonly AnimationStepV2[]): AnimationStepV2[] {
  if (!steps.length) return [];
  const end = Math.max(...steps.map((step) => (step.startAtMs ?? 0) + (step.durationMs ?? 0)));
  return [
    ...steps,
    {
      id: `${steps[0]!.id}:reading-pause`,
      type: "hold",
      startAtMs: end,
      durationMs: GUNDAM_ANIMATION_DURATION_MS.readingPause,
    },
  ];
}

export function staggerGundamCardTransfers(steps: readonly AnimationStepV2[]): AnimationStepV2[] {
  return steps.map((step, index) => {
    const staggerMs = Math.min(
      GUNDAM_ANIMATION_DURATION_MS.maxStagger,
      consecutiveAnimationStaggerMs(
        steps,
        index,
        (candidate) =>
          candidate.type === "entityTransfer" ? gundamTransferRoute(candidate) : null,
        GUNDAM_ANIMATION_DURATION_MS.stagger,
      ),
    );
    if (staggerMs === 0 || step.type !== "entityTransfer" || step.startAtMs !== undefined) {
      return step;
    }

    return {
      ...step,
      startAtMs: staggerMs,
    };
  });
}

function gundamTransferRoute(step: Extract<AnimationStepV2, { type: "entityTransfer" }>): string {
  const routePart = (ref: AnimationRef | undefined): string => {
    if (!ref) return "none";
    return ref.kind === "zone"
      ? `${ref.kind}:${ref.id}:${ref.ownerId ?? ""}`
      : `${ref.kind}:${ref.id}`;
  };
  return `${routePart(step.from)}>${routePart(step.to)}`;
}

export function projectedTurnAnimationPlan(
  previousTurn: number,
  currentTurn: { readonly number: number; readonly playerId: string },
): AnimationPlanV2 {
  const id = `turn:${currentTurn.number}:${currentTurn.playerId}`;
  return animationPlan(id, {
    id: `${id}:change`,
    type: "phaseChange",
    from: `Turn ${previousTurn}`,
    to: `Turn ${currentTurn.number}`,
    variant: "turn",
    player: { kind: "player", id: currentTurn.playerId },
    turnNumber: Math.max(1, currentTurn.number),
    audioCue: "turn.change",
  });
}

function gundamCardMoveAudioCue(
  fromZoneId: string | undefined,
  toZoneId: string,
): SimulatorAudioCueId {
  if (baseZoneId(fromZoneId) === "deck" && baseZoneId(toZoneId) === "hand") {
    return "card.draw";
  }
  if (baseZoneId(toZoneId) === "trash") {
    return "card.discard";
  }
  if (baseZoneId(toZoneId) === "resourceArea") {
    return "resource.gain";
  }
  return "card.move";
}

function gundamFaceForZone(
  zoneId: string | undefined,
  ownerId: string,
  viewerSeatId: string | null,
): "public" | "hidden" {
  const zone = baseZoneId(zoneId);
  if (zone === "deck" || zone === "resourceDeck" || zone === "shieldArea") return "hidden";
  if (zone === "hand" && ownerId !== viewerSeatId) return "hidden";
  return "public";
}

function ownerIdForCard(
  cardId: string,
  view: GundamAnimationView,
  fallbackOwnerId: string,
): string {
  return (
    findCardByInstanceId(view, cardId)?.ownerId ?? ownerIdFromCardId(cardId) ?? fallbackOwnerId
  );
}

function ownerIdFromCardId(cardId: string): string | null {
  const match = /^(.*)_(deck|resourceDeck|resource|shield)_/.exec(cardId);
  return match?.[1] ?? null;
}

function opponentOf(view: GundamAnimationView, playerId: string): string | null {
  for (const player of view.players) {
    const candidate = String(player.playerId);
    if (candidate !== playerId) {
      return candidate;
    }
  }
  return null;
}

function animationPlan(id: string, step: AnimationStepV2): AnimationPlanV2 {
  return { id, version: 2, steps: [step] };
}

function commandResolutionPlan(
  id: string,
  cardId: string,
  ownerId: string,
  initialDelayMs: number,
  targets: readonly AnimationEntityRef[] = [],
  cleanup = true,
): AnimationPlanV2 {
  const entity = entityRef(cardId);
  const source = commandFocusRef();
  const effectDurationMs = GUNDAM_ANIMATION_DURATION_MS.commandEffect;
  return {
    id,
    version: 2,
    steps: sequenceGundamAnimationGroups([
      { steps: [], durationMs: initialDelayMs },
      {
        steps: [
          targets.length > 0
            ? {
                id: `${id}:effect`,
                type: "effect",
                source,
                targets: [...targets],
                label: "COMMAND EFFECT",
                durationMs: effectDurationMs,
                audioCue: "effect.trigger",
              }
            : {
                id: `${id}:effect`,
                type: "emphasize",
                at: source,
                style: "spotlight",
                label: "COMMAND EFFECT",
                durationMs: effectDurationMs,
                audioCue: "effect.trigger",
              },
        ],
        durationMs: effectDurationMs + GUNDAM_ANIMATION_DURATION_MS.readingPause,
      },
      {
        steps: cleanup
          ? [
              {
                id: `${id}:cleanup`,
                type: "entityTransfer",
                entity,
                from: source,
                to: gundamZoneRef("trash", ownerId),
                sourceFace: "public",
                destinationFace: "public",
                durationMs: GUNDAM_ANIMATION_DURATION_MS.commandCleanup,
                audioCue: "card.discard",
              },
            ]
          : [],
        durationMs: GUNDAM_ANIMATION_DURATION_MS.commandCleanup,
      },
    ]),
  };
}

function commandFocusRef(): AnimationAnchorRef {
  return { kind: "anchor", id: GUNDAM_COMMAND_FOCUS_ANCHOR_ID };
}

function stringParam(params: Record<string, unknown>, key: string): string | null {
  return typeof params[key] === "string" ? params[key] : null;
}

function numberParam(params: Record<string, unknown>, key: string): number | null {
  const value = params[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringArrayParam(params: Record<string, unknown>, key: string): string[] {
  const value = params[key];
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function isCommandCard(view: GundamAnimationView, cardId: string): boolean {
  return findCardByInstanceId(view, cardId)?.definition?.type === "command";
}

function entityRef(id: string): AnimationEntityRef {
  return { kind: "entity", id };
}

function gundamZoneRef(zoneId: string, ownerId: string): AnimationZoneRef {
  return {
    kind: "zone",
    id: zoneId.includes(":") ? zoneId : `${zoneId}:${ownerId}`,
    ownerId,
  };
}

export function gundamAnimationPlan(
  id: string,
  animations: readonly PacketAnimation[],
  fallbackOwnerId: string,
  view: GundamAnimationView,
): AnimationPlanV2 | null {
  const steps = animations.flatMap((animation) =>
    gundamPacketAnimationToAnimationPlans(
      {
        animation:
          animation.data.kind === "cardMove" && !animation.data.ownerId
            ? { ...animation, data: { ...animation.data, ownerId: fallbackOwnerId } }
            : animation,
      },
      view,
      null,
    ).flatMap((plan) => plan.steps),
  );
  return steps.length ? { id, version: 2, steps: prepareGundamSharedAnimationSteps(steps) } : null;
}

/** Each group runs simultaneously; groups run in order. Durations include reading time. */
export function sequenceGundamAnimationGroups(
  groups: readonly {
    readonly steps: readonly AnimationStepV2[];
    readonly durationMs: number;
  }[],
): AnimationStepV2[] {
  let offset = 0;
  return groups.flatMap((group) => {
    const steps = group.steps.map((step) => ({
      ...step,
      startAtMs: offset + (step.startAtMs ?? 0),
    }));
    offset += group.durationMs;
    return steps;
  });
}

export function buildMulliganRedrawPlan({
  move,
  partialInput,
  previousView,
  nextState,
  playerId,
  stateID,
}: {
  readonly move: string;
  readonly partialInput: Readonly<Record<string, unknown>>;
  readonly previousView: GundamAnimationView;
  readonly nextState: import("@tcg/gundam-engine").MatchState;
  readonly playerId: string;
  readonly stateID: number;
}): AnimationPlanV2 | null {
  if (move !== "alterHand" || partialInput.wantsRedraw !== true) return null;

  const handZoneId = `hand:${playerId}`;
  const oldHandIds =
    previousView.zones.zones[handZoneId]?.cards.map((card) => card.instanceId) ?? [];
  const newHandIds = nextState.ctx.zones.private.zoneCards[handZoneId] ?? [];
  const retainedIds = new Set(oldHandIds.filter((cardId) => newHandIds.includes(cardId)));
  const returnedIds = oldHandIds.filter((cardId) => !retainedIds.has(cardId));
  const replacementIds = newHandIds.filter((cardId) => !retainedIds.has(cardId));
  if (returnedIds.length === 0 && replacementIds.length === 0) return null;

  const hand = { kind: "zone" as const, id: handZoneId, ownerId: playerId };
  const deck = { kind: "zone" as const, id: `deck:${playerId}`, ownerId: playerId };
  const returnStaggerMs = GUNDAM_ANIMATION_DURATION_MS.stagger;
  const returnDurationMs = GUNDAM_ANIMATION_DURATION_MS.transfer;
  const returnEndMs =
    returnedIds.length === 0 ? 0 : (returnedIds.length - 1) * returnStaggerMs + returnDurationMs;
  const shuffleDurationMs = GUNDAM_ANIMATION_DURATION_MS.effectHold;
  const drawStartMs = returnEndMs;
  const drawEndMs =
    replacementIds.length === 0
      ? drawStartMs
      : drawStartMs + (replacementIds.length - 1) * returnStaggerMs + returnDurationMs;

  return {
    id: `gundam:mulligan-redraw:${stateID}:${playerId}`,
    version: 2,
    steps: [
      ...returnedIds.map((cardId, index) => ({
        id: `gundam:mulligan-redraw:${stateID}:return:${cardId}`,
        type: "entityTransfer" as const,
        entity: { kind: "entity" as const, id: cardId },
        from: hand,
        to: deck,
        sourceFace: "public" as const,
        destinationFace: "hidden" as const,
        startAtMs: index * returnStaggerMs,
        durationMs: returnDurationMs,
        audioCue: "card.move" as const,
      })),
      ...replacementIds.map((cardId, index) => ({
        id: `gundam:mulligan-redraw:${stateID}:draw:${cardId}`,
        type: "entityTransfer" as const,
        entity: { kind: "entity" as const, id: cardId },
        from: deck,
        to: hand,
        sourceFace: "hidden" as const,
        destinationFace: "public" as const,
        startAtMs: drawStartMs + index * returnStaggerMs,
        durationMs: returnDurationMs,
        audioCue: "card.draw" as const,
      })),
      {
        id: `gundam:mulligan-redraw:${stateID}:shuffle`,
        type: "randomization" as const,
        at: deck,
        kind: "shuffle" as const,
        startAtMs: drawEndMs,
        durationMs: shuffleDurationMs,
        audioCue: "deck.shuffle" as const,
      },
    ],
  };
}

/** Lifecycle transitions do not always emit move logs. Fill only missing visuals. */
export function gundamLifecycleAnimationSteps(
  before: GundamAnimationView,
  after: GundamAnimationView,
  existing: readonly AnimationStepV2[],
  viewerSeatId: string | null,
): AnimationStepV2[] {
  const transfers = new Set(
    existing.flatMap((step) => (step.type === "entityTransfer" ? [step.entity.id] : [])),
  );
  const states = new Set(
    existing.flatMap((step) => (step.type === "entityStateChange" ? [step.entity.id] : [])),
  );
  const previous = new Map(
    Object.entries(before.zones.zones).flatMap(([zoneId, zone]) =>
      zone.cards.map((card) => [card.instanceId, { zoneId, card }] as const),
    ),
  );
  const steps: AnimationStepV2[] = [];
  for (const [zoneId, zone] of Object.entries(after.zones.zones)) {
    for (const card of zone.cards) {
      const old = previous.get(card.instanceId);
      const destination = baseZoneId(zoneId);
      const sourceZone =
        old?.zoneId ??
        (destination === "resourceArea"
          ? `resourceDeck:${card.ownerId}`
          : destination === "hand" || destination === "shieldArea"
            ? `deck:${card.ownerId}`
            : undefined);
      if (!transfers.has(card.instanceId) && sourceZone && sourceZone !== zoneId) {
        steps.push({
          id: `lifecycle:${card.instanceId}:${sourceZone}:${zoneId}`,
          type: "entityTransfer",
          entity: entityRef(card.instanceId),
          from: gundamZoneRef(sourceZone, card.ownerId),
          to: gundamZoneRef(zoneId, card.ownerId),
          sourceFace: gundamFaceForZone(sourceZone, card.ownerId, viewerSeatId),
          destinationFace: gundamFaceForZone(zoneId, card.ownerId, viewerSeatId),
          durationMs: GUNDAM_ANIMATION_DURATION_MS.transfer,
          audioCue: gundamCardMoveAudioCue(sourceZone, zoneId),
        });
      } else if (
        old &&
        old.zoneId === zoneId &&
        !states.has(card.instanceId) &&
        Boolean(old.card.meta?.exhausted) !== Boolean(card.meta?.exhausted)
      ) {
        if (destination === "resourceArea") {
          // Compact resource rows render aggregate ready counts, not instance nodes.
          // Spending already carries RES feedback; readying gets one shared count.
          const id = `lifecycle:${card.ownerId}:resources-ready`;
          if (!card.meta?.exhausted && !steps.some((step) => step.id === id)) {
            const count = zone.cards.filter(
              (entry) =>
                previous.get(entry.instanceId)?.card.meta?.exhausted && !entry.meta?.exhausted,
            ).length;
            steps.push({
              id,
              type: "valueDelta",
              subject: { kind: "anchor", id: `resourceArea:${card.ownerId}` },
              label: "READY",
              delta: count,
              durationMs: GUNDAM_ANIMATION_DURATION_MS.effectHold,
            });
          }
          continue;
        }
        steps.push({
          id: `lifecycle:${card.instanceId}:orientation`,
          type: "entityStateChange",
          entity: entityRef(card.instanceId),
          at: entityRef(card.instanceId),
          change: "orientation",
          sourceFace: gundamFaceForZone(zoneId, card.ownerId, viewerSeatId),
          destinationFace: gundamFaceForZone(zoneId, card.ownerId, viewerSeatId),
          fromRotationDeg: old.card.meta?.exhausted ? 20 : 0,
          toRotationDeg: card.meta?.exhausted ? 20 : 0,
          durationMs: GUNDAM_ANIMATION_DURATION_MS.stateChange,
        });
      }
    }
  }
  return steps;
}
