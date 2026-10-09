import {
  settledContinuousCost,
  settledContinuousPower,
  settledContinuousBasePower,
  settledContinuousBaseCost,
} from "./engine/continuous-cost.ts";
import { matchesTrait } from "../../utils/src/traits.ts";
import { currentEffectTriggerEvent } from "./effects/trigger-context.ts";
import { candidatePoolForTarget } from "./effects/targeting.ts";
import { currentReplacementProcess } from "./effects/replacement-process.ts";
import { getCard } from "../../cards/src/runtime-catalog.ts";
import type { EffectBlock, Keyword, OPCard } from "@tcg/op-types";
import { createRandomAPI } from "@tcg/engine-core";
import type {
  CardInstance,
  EngineCapabilityIssue,
  EngineActor,
  EngineEvent,
  GameLogEntry,
  MatchConfig,
  MatchSeat,
  MatchState,
  ModifierState,
  PlayerState,
  ResolutionItem,
} from "./types.ts";
import {
  arePlayerEffectsNegatedByPermanentEffect,
  getPermanentKeywords,
  getPermanentActivationConditions,
  getContinuousCardCost,
  getEvaluatingCardCost,
  getEvaluatingBaseCost,
  getEvaluatingBasePower,
  evaluatingLegacyBasePower,
  getEvaluatingCardPower,
  getPermanentModifierTotal,
  getPermanentSetBasePower,
  getPermanentSetCost,
  getPermanentSetBaseCost,
  getPermanentSetCounter,
  isRefreshPreventedByPermanentEffect,
} from "./effects/permanent.ts";

type ResolutionItemInput = ResolutionItem extends infer T
  ? T extends ResolutionItem
    ? Omit<T, "id">
    : never
  : never;

const DEFAULT_OPENING_HAND_SIZE = 5;
const DEFAULT_MAX_CHARACTER_SLOTS = 5;

export function otherSeat(seat: MatchSeat): MatchSeat {
  return seat === "north" ? "south" : "north";
}

export function shuffle<T>(values: T[], seedInput: number | string | undefined): T[] {
  const api = createRandomAPI(String(seedInput ?? "0"));
  return api.shuffle([...values]);
}

export function normalizeConfig(config: MatchConfig): MatchState["config"] {
  return {
    ...config,
    judgeFallback: config.judgeFallback ?? true,
    openingHandSize: config.openingHandSize ?? DEFAULT_OPENING_HAND_SIZE,
    maxCharacterSlots: config.maxCharacterSlots ?? DEFAULT_MAX_CHARACTER_SLOTS,
    shuffleDecks: config.shuffleDecks ?? false,
    skipFirstTurnDraw: config.skipFirstTurnDraw ?? true,
  };
}

export function nextIdentifier(state: MatchState, prefix: string): string {
  state.idCounter += 1;
  return `${prefix}-${String(state.idCounter).padStart(6, "0")}`;
}

export function cardName(card: OPCard): string {
  return card.i18n.en.name;
}

export function cardNames(card: OPCard): readonly string[] {
  return [cardName(card), ...(card.alternateNames ?? [])];
}

export function cardMatchesName(
  card: OPCard,
  name: string,
  match: "exact" | "includes" = "exact",
): boolean {
  if (card.cardType === "leader" && card.rulesIdentity?.allNames) return true;
  return cardNames(card).some((candidate) =>
    match === "includes" ? candidate.includes(name) : candidate === name,
  );
}

export function cardsShareName(first: OPCard, second: OPCard): boolean {
  return (
    (first.cardType === "leader" && Boolean(first.rulesIdentity?.allNames)) ||
    cardNames(first).some((name) => cardMatchesName(second, name))
  );
}

export function cardMatchesTrait(
  card: OPCard,
  trait: string,
  match: "exact" | "includes" = "exact",
): boolean {
  return (
    (card.cardType === "leader" && Boolean(card.rulesIdentity?.allTraits)) ||
    matchesTrait(card.traits ?? [], trait, match)
  );
}

export function basePower(card: OPCard): number {
  if (card.cardType === "leader" || card.cardType === "character") {
    return card.power ?? 0;
  }

  return 0;
}

export function baseCost(card: OPCard): number {
  if (card.cardType === "character" || card.cardType === "event" || card.cardType === "stage") {
    return card.cost;
  }

  return 0;
}

export function getCardCounter(state: MatchState, instanceId: string): number {
  const card = getCardForInstance(state, instanceId);
  if (card.cardType !== "character") {
    return 0;
  }
  return (
    getPermanentSetCounter(state, instanceId) ??
    (card.counter ?? 0) + getPermanentModifierTotal(state, instanceId, "counter")
  );
}

export function leaderLife(card: OPCard): number {
  return card.cardType === "leader" ? card.life : 0;
}

/** 2-9: effective Leader characteristic. Physical Life cards are tracked separately. */
export function getLeaderLifeValue(state: MatchState, instanceId: string): number {
  const card = getCardForInstance(state, instanceId);
  if (card.cardType !== "leader") return 0;
  const resolved = Object.values(state.modifiers).reduce(
    (sum, modifier) =>
      modifier.targetId === instanceId && modifier.type === "lifeValue"
        ? sum + (modifier.value ?? 0)
        : sum,
    0,
  );
  // 1-3-6 retains signed values for arithmetic, then floors the observed value.
  return Math.max(
    0,
    card.life + resolved + getPermanentModifierTotal(state, instanceId, "lifeValue"),
  );
}

export function effectBlocksFor(card: OPCard, trigger: EffectBlock["trigger"]): EffectBlock[] {
  return card.effects?.effects?.filter((block) => block.trigger === trigger) ?? [];
}

export function effectsAreNegated(
  state: MatchState,
  instanceId: string,
  trigger?: EffectBlock["trigger"],
): boolean {
  const targetController = getInstance(state, instanceId).controller;
  const targetLeaderId = getPlayer(state, targetController).leaderInstanceId;
  return (
    Object.values(state.modifiers).some(
      (modifier) =>
        (modifier.targetId === instanceId ||
          (modifier.playerScope && modifier.targetId === targetLeaderId)) &&
        modifier.type === "flag" &&
        modifier.flag === "effectsNegated" &&
        (!modifier.negatedEffectTypes?.length ||
          (trigger !== undefined && modifier.negatedEffectTypes.includes(trigger))),
    ) || arePlayerEffectsNegatedByPermanentEffect(state, instanceId, trigger)
  );
}

export function effectBlocksForInstance(
  state: MatchState,
  instanceId: string,
  trigger: EffectBlock["trigger"],
): EffectBlock[] {
  if (effectsAreNegated(state, instanceId, trigger)) return [];
  const instance = getInstance(state, instanceId);
  // Modifier insertion order is effect resolution order (8-3-1-2).
  const additions = Object.values(state.modifiers).flatMap((modifier) => {
    const requirement = modifier.activationRequirements;
    return modifier.type === "activationRequirements" &&
      modifier.targetId === instanceId &&
      requirement &&
      requirement.targetZoneChangeCounter === instance.zoneChangeCounter &&
      (!requirement.effectTypes || requirement.effectTypes.includes(trigger))
      ? [requirement]
      : [];
  });
  const permanentConditions = getPermanentActivationConditions(state, instanceId, trigger);
  return effectBlocksFor(getCardForInstance(state, instanceId), trigger).map((block) => {
    if (!additions.length && !permanentConditions.length) return block;
    const costs = additions.flatMap((addition) => addition.costs ?? []);
    const conditions = additions.flatMap((addition) => addition.conditions ?? []);
    return {
      ...block,
      conditions: [...(block.conditions ?? []), ...conditions, ...permanentConditions],
      // Common printed costs and the chosen printed alternative precede additions.
      ...(block.alternativeCosts
        ? {
            alternativeCosts: block.alternativeCosts.map((alternative) => [
              ...alternative,
              ...costs,
            ]),
          }
        : { costs: [...(block.costs ?? []), ...costs] }),
    };
  });
}

export function emitEvent(
  state: MatchState,
  type: EngineEvent["type"],
  actor: EngineActor,
  payload: {
    sourceCardId?: string | null;
    sourceInstanceId?: string | null;
    targetIds?: string[];
    eventId?: string | null;
    visibility?: EngineEvent["visibility"];
    data?: Record<string, string | number | boolean | string[] | null>;
  } = {},
): EngineEvent {
  state.eventSequence += 1;
  const event: EngineEvent = {
    id: nextIdentifier(state, "evt"),
    sequence: state.eventSequence,
    turn: state.turnNumber,
    phase: state.phase,
    type,
    actor,
    sourceCardId: payload.sourceCardId ?? null,
    sourceInstanceId: payload.sourceInstanceId ?? null,
    targetIds: payload.targetIds ?? [],
    eventId: payload.eventId ?? null,
    visibility: payload.visibility ?? "public",
    payload: payload.data ?? {},
  };
  state.eventHistory.push(event);
  return event;
}

export function emitLog(
  state: MatchState,
  actor: EngineActor,
  message: string,
  payload: {
    sourceCardId?: string | null;
    sourceInstanceId?: string | null;
    targetIds?: string[];
    eventId?: string | null;
    visibility?: GameLogEntry["visibility"];
    privateMessages?: Partial<Record<MatchSeat, string>>;
    judgeMessage?: string | null;
  } = {},
): GameLogEntry {
  state.logSequence += 1;
  const entry: GameLogEntry = {
    id: nextIdentifier(state, "log"),
    turn: state.turnNumber,
    phase: state.phase,
    sequence: state.logSequence,
    actor,
    sourceCardId: payload.sourceCardId ?? null,
    sourceInstanceId: payload.sourceInstanceId ?? null,
    targetIds: payload.targetIds ?? [],
    eventId: payload.eventId ?? null,
    visibility: payload.visibility ?? "public",
    message,
    privateMessages: payload.privateMessages ?? {},
    judgeMessage: payload.judgeMessage ?? null,
  };
  state.logHistory.push(entry);
  return entry;
}

export function enqueueResolution(
  state: MatchState,
  item: ResolutionItemInput,
  options: { next?: boolean } = {},
): ResolutionItem {
  const nextItem = {
    ...item,
    ...(item.kind === "effectAction" && {
      replacementProcess: item.replacementProcess ?? currentReplacementProcess(state),
      effectTriggerEvent: item.effectTriggerEvent ?? currentEffectTriggerEvent(state),
    }),
    id: nextIdentifier(state, "res"),
  } as ResolutionItem;
  if (
    nextItem.kind === "effectBlock" &&
    isAutomaticEffectTrigger(nextItem.trigger) &&
    !nextItem.readyEffectSelected &&
    !nextItem.confirmed &&
    !nextItem.costsPaid
  ) {
    const source = getInstance(state, nextItem.sourceInstanceId);
    const block = effectBlocksForInstance(state, source.instanceId, nextItem.trigger)[
      nextItem.blockIndex
    ];
    // [DON!! xX] must be fulfilled when the auto effect triggers (8-3-2-3).
    if (
      block?.conditions?.some(
        (condition) =>
          condition.condition === "donAttached" && source.attachedDon < condition.amount,
      )
    )
      return nextItem;
    const isOwnKo =
      nextItem.triggerEvent?.instanceId === source.instanceId &&
      nextItem.triggerEvent.koCause !== undefined &&
      source.zone === "character";
    nextItem.sourceZoneChangeCounter ??= source.zoneChangeCounter + (isOwnKo ? 1 : 0);
    (state.pendingAutoEffects ??= []).push(nextItem);
  } else if (options.next) {
    state.resolutionQueue.unshift(nextItem);
  } else {
    state.resolutionQueue.push(nextItem);
  }
  state.resolutionStatus = "running";
  emitEvent(state, "resolutionQueued", "system", {
    sourceInstanceId:
      "sourceInstanceId" in nextItem && typeof nextItem.sourceInstanceId === "string"
        ? nextItem.sourceInstanceId
        : null,
    sourceCardId:
      "sourceInstanceId" in nextItem && typeof nextItem.sourceInstanceId === "string"
        ? getInstance(state, nextItem.sourceInstanceId).cardId
        : null,
    visibility: "public",
    data: {
      resolutionId: nextItem.id,
      kind: nextItem.kind,
    },
  });
  return nextItem;
}

export function isAutomaticEffectTrigger(trigger: EffectBlock["trigger"]): boolean {
  return !["main", "counter", "activateMain", "trigger"].includes(trigger);
}

export function enqueueEffectsForTrigger(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  trigger: EffectBlock["trigger"],
  trashHandIds: string[] | undefined,
  triggerEvent?: Extract<ResolutionItem, { kind: "effectBlock" }>["triggerEvent"],
) {
  const source = getInstance(state, sourceInstanceId);
  const blocks = effectBlocksForInstance(state, sourceInstanceId, trigger);
  let enqueued = 0;
  // Within one enqueue pass, only one block may use a given oncePerTurnKey
  // (e.g. OP12-081 Koala dual predicates for the same play event).
  const keysQueuedThisPass = new Set<string>();

  for (const [index, block] of blocks.entries()) {
    const effectKey = block.oncePerTurnKey ?? `${trigger}:${index}`;
    if (block.oncePerTurn && source.usedEffectKeys.includes(effectKey)) {
      continue;
    }
    if (block.oncePerTurn && keysQueuedThisPass.has(effectKey)) {
      continue;
    }
    enqueueResolution(state, {
      kind: "effectBlock",
      sourceInstanceId,
      controller,
      trigger,
      blockIndex: index,
      trashHandIds,
      triggerEvent,
    });
    if (block.oncePerTurn) {
      keysQueuedThisPass.add(effectKey);
    }
    enqueued += 1;
  }

  return enqueued;
}

export function enqueueInPlayEffectsForTrigger(
  state: MatchState,
  trigger: EffectBlock["trigger"],
  triggerEvent?: Extract<ResolutionItem, { kind: "effectBlock" }>["triggerEvent"],
  sourceControllers?: readonly MatchSeat[],
  excludeInstanceIds?: readonly string[],
) {
  // 8-6-1: when both players' effect timings are fulfilled at the same time,
  // the turn player's effects resolve first.
  const seats = sourceControllers ?? [state.activeSeat, otherSeat(state.activeSeat)];
  for (const seat of seats) {
    for (const source of Object.values(state.cards)) {
      if (source.controller !== seat) {
        continue;
      }
      if (excludeInstanceIds?.includes(source.instanceId)) {
        continue;
      }
      const player = getPlayer(state, source.controller);
      const isInPlay =
        (source.zone === "leader" && player.leaderInstanceId === source.instanceId) ||
        (source.zone === "character" && player.characterArea.includes(source.instanceId)) ||
        (source.zone === "stage" && player.stageArea === source.instanceId);
      if (!isInPlay) {
        continue;
      }
      enqueueEffectsForTrigger(
        state,
        source.instanceId,
        source.controller,
        trigger,
        undefined,
        triggerEvent,
      );
    }
  }
}

// 8-6-1: one occurrence can fulfill the acting player's "when you ..." trigger
// and their opponent's mirrored "when your opponent ..." trigger at the same
// time (e.g. a Counter Event played during the opponent's turn, or an effect
// that plays a Character during the opponent's turn). Enqueue the turn
// player's side first even when the acting player is not the turn player.
export function enqueueMirroredInPlayEffectsForTrigger(
  state: MatchState,
  actor: MatchSeat,
  actorTrigger: EffectBlock["trigger"],
  opponentTrigger: EffectBlock["trigger"],
  triggerEvent?: Extract<ResolutionItem, { kind: "effectBlock" }>["triggerEvent"],
) {
  if (actorTrigger === "whenYouActivateEvent" && triggerEvent?.instanceId !== undefined) {
    const player = getPlayer(state, actor);
    const activatedBaseCost =
      triggerEvent.baseCostAtActivation ?? getBaseCost(state, triggerEvent.instanceId);
    const existing = player.activatedEvent;
    player.activatedEvent =
      existing && existing.turnNumber === state.turnNumber
        ? {
            turnNumber: existing.turnNumber,
            bestBaseCost: Math.max(existing.bestBaseCost, activatedBaseCost),
          }
        : { turnNumber: state.turnNumber, bestBaseCost: activatedBaseCost };
  }
  for (const seat of [state.activeSeat, otherSeat(state.activeSeat)]) {
    enqueueInPlayEffectsForTrigger(
      state,
      seat === actor ? actorTrigger : opponentTrigger,
      triggerEvent,
      [seat],
    );
  }
}

// 8-6-1: a K.O. fulfills the K.O.'d card's own [On K.O.] / [When a Character
// is K.O.'d] effects and every in-play [When a Character is K.O.'d] listener
// at the same time, so each player's effects enqueue turn player first.
// 10-2-17-1: callers invoke this while the K.O.'d card is still on the field,
// so the card's own effects and negation state are evaluated on the field;
// the card itself is excluded from the in-play listener scan because its own
// [When a Character is K.O.'d] effects are enqueued directly.
export function enqueueKoEffectsForTrigger(
  state: MatchState,
  targetId: string,
  targetController: MatchSeat,
  triggerEvent: Extract<ResolutionItem, { kind: "effectBlock" }>["triggerEvent"],
) {
  // The K.O. event observes characteristics before area-change effects expire.
  // OP14-053/OP13-002: Vista retains its observed base power for Ace's trigger.
  if (triggerEvent) {
    triggerEvent = {
      ...triggerEvent,
      koBasePower:
        currentReplacementProcess(state)?.koBasePowers?.find(
          (entry) =>
            entry.instanceId === targetId &&
            entry.zoneChangeCounter === getInstance(state, targetId).zoneChangeCounter,
        )?.value ??
        getSetBasePower(state, targetId) ??
        basePower(getCardForInstance(state, targetId)),
    };
  }
  if (getCardForInstance(state, targetId).cardType === "character") {
    emitEvent(state, "characterKod", triggerEvent?.effectController ?? targetController, {
      sourceInstanceId: triggerEvent?.sourceInstanceId ?? null,
      targetIds: [targetId],
      data: {
        targetController,
        targetOwner: getInstance(state, targetId).owner,
        koCause: triggerEvent?.koCause ?? null,
        effectController: triggerEvent?.effectController ?? null,
      },
    });
  }
  for (const seat of [state.activeSeat, otherSeat(state.activeSeat)]) {
    if (targetController === seat) {
      enqueueEffectsForTrigger(state, targetId, targetController, "onKo", undefined, triggerEvent);
      enqueueEffectsForTrigger(
        state,
        targetId,
        targetController,
        "whenCharacterKod",
        undefined,
        triggerEvent,
      );
    }
    enqueueInPlayEffectsForTrigger(state, "whenCharacterKod", triggerEvent, [seat], [targetId]);
  }
}

export function recordCapabilityIssue(
  state: MatchState,
  issue: Omit<EngineCapabilityIssue, "id" | "sequence" | "turn" | "phase">,
): EngineCapabilityIssue {
  state.capabilitySequence += 1;
  const nextIssue: EngineCapabilityIssue = {
    id: nextIdentifier(state, "cap"),
    sequence: state.capabilitySequence,
    turn: state.turnNumber,
    phase: state.phase,
    ...issue,
  };
  state.capabilityHistory.push(nextIssue);
  emitEvent(state, "capabilityIssue", issue.actor, {
    sourceCardId: issue.sourceCardId,
    sourceInstanceId: issue.sourceInstanceId,
    eventId: issue.eventId,
    visibility: issue.actor === "judge" ? "judge" : "public",
    data: {
      kind: issue.kind,
      code: issue.code,
    },
  });
  return nextIssue;
}

export function getPlayer(state: MatchState, seat: MatchSeat): PlayerState {
  return state.players[seat];
}

export function getInstance(state: MatchState, instanceId: string): CardInstance {
  const instance = state.cards[instanceId];

  if (!instance) {
    throw new Error(`Unknown card instance: ${instanceId}`);
  }

  return instance;
}

export function restCard(
  state: MatchState,
  instanceId: string,
  effectController: MatchSeat,
  sourceInstanceId?: string,
): boolean {
  const instance = getInstance(state, instanceId);
  if (instance.rested) {
    return false;
  }

  instance.rested = true;
  enqueueInPlayEffectsForTrigger(state, "whenBecomesRested", {
    instanceId,
    effectController,
    sourceInstanceId,
    targetInstanceId: instanceId,
  });
  return true;
}

/** Publish a completed transfer without resolving reactions inside its parent effect. */
export function publishDonGiven(
  state: MatchState,
  recipientId: string,
  amount: number,
  effectController: MatchSeat,
  sourceInstanceId?: string,
): void {
  if (amount <= 0) return;
  const recipient = getInstance(state, recipientId);
  emitEvent(state, "donAttached", effectController, {
    sourceCardId: recipient.cardId,
    sourceInstanceId: recipientId,
    targetIds: [recipientId],
    visibility: "public",
    data: { amount },
  });
  // OP02 Q270: giving two DON!! with ST01-011 Brook fulfills Garp's
  // trigger twice. Append the reactions so the current effect finishes first.
  for (let index = 0; index < amount; index += 1) {
    enqueueInPlayEffectsForTrigger(state, "whenDonGiven", {
      instanceId: recipientId,
      targetInstanceId: recipientId,
      effectController,
      sourceInstanceId,
      amount: 1,
    });
  }
}

export function donCardsOnField(state: MatchState, seat: MatchSeat): number {
  const player = getPlayer(state, seat);
  return (
    player.activeDon +
    player.restedDon +
    getInstance(state, player.leaderInstanceId).attachedDon +
    player.characterArea
      .filter((entry): entry is string => Boolean(entry))
      .reduce((total, instanceId) => total + getInstance(state, instanceId).attachedDon, 0)
  );
}

export function getCardForInstance(state: MatchState, instanceId: string): OPCard {
  return getCard(getInstance(state, instanceId).cardId);
}

export function getPowerModifierTotal(state: MatchState, instanceId: string): number {
  return Object.values(state.modifiers).reduce((total, modifier) => {
    if (modifier.targetId !== instanceId || modifier.type !== "power") {
      return total;
    }

    return total + (modifier.value ?? 0);
  }, 0);
}

export function getCostModifierTotal(state: MatchState, instanceId: string): number {
  return Object.values(state.modifiers).reduce((total, modifier) => {
    if (modifier.targetId !== instanceId || modifier.type !== "cost" || modifier.nextPaidPlay) {
      return total;
    }

    return total + (modifier.value ?? 0);
  }, 0);
}

export function hasFlagModifier(
  state: MatchState,
  instanceId: string,
  flag: NonNullable<ModifierState["flag"]>,
): boolean {
  return Object.values(state.modifiers).some(
    (modifier) =>
      modifier.targetId === instanceId && modifier.type === "flag" && modifier.flag === flag,
  );
}

export function isDonActivationByCharacterEffectPrevented(
  state: MatchState,
  sourceInstanceId: string,
  affectedSeat: MatchSeat,
): boolean {
  return (
    getCardForInstance(state, sourceInstanceId).cardType === "character" &&
    hasFlagModifier(
      state,
      getPlayer(state, affectedSeat).leaderInstanceId,
      "cannotSetDonActiveByCharacterEffects",
    )
  );
}

export function isKeywordActivationPrevented(
  state: MatchState,
  instanceId: string,
  keyword: Keyword,
): boolean {
  const instance = getInstance(state, instanceId);
  const controllerLeaderId = getPlayer(state, instance.controller).leaderInstanceId;
  return Object.values(state.modifiers).some(
    (modifier) =>
      (modifier.targetId === instanceId ||
        (modifier.playerScope === true && modifier.targetId === controllerLeaderId)) &&
      modifier.type === "flag" &&
      modifier.flag === "cannotActivate" &&
      modifier.keyword === keyword,
  );
}

export function getKeywords(state: MatchState, instanceId: string): Set<Keyword> {
  const card = getCardForInstance(state, instanceId);
  const keywords = new Set<Keyword>(
    card.effects?.keywords?.length && !effectsAreNegated(state, instanceId)
      ? card.effects.keywords
      : [],
  );

  for (const modifier of Object.values(state.modifiers)) {
    if (modifier.targetId !== instanceId || modifier.type !== "keyword" || !modifier.keyword) {
      continue;
    }

    keywords.add(modifier.keyword);
  }

  for (const keyword of getPermanentKeywords(state, instanceId)) {
    keywords.add(keyword);
  }

  return keywords;
}

export function isCardPreventedFromRefreshing(state: MatchState, instanceId: string): boolean {
  return (
    hasFlagModifier(state, instanceId, "freeze") ||
    isRefreshPreventedByPermanentEffect(state, instanceId)
  );
}

// 4-9-2-1: when several effects set the same card's base power, the highest
// set value applies instead of the printed base; additive power modifiers and
// given DON!! power then apply on top of that resolved base.
export function getSetBasePower(state: MatchState, instanceId: string): number | null {
  if (!evaluatingLegacyBasePower(state)) {
    const evaluating = getEvaluatingBasePower(state, instanceId);
    if (evaluating !== undefined) return evaluating;
    const settled = settledContinuousBasePower(state, instanceId);
    if (settled !== undefined) return settled;
  }
  let setBasePower = getPermanentSetBasePower(state, instanceId);
  for (const modifier of Object.values(state.modifiers)) {
    if (modifier.targetId !== instanceId || modifier.type !== "basePower") {
      continue;
    }
    const value = modifier.value ?? 0;
    setBasePower = setBasePower === null ? value : Math.max(setBasePower, value);
  }
  return setBasePower;
}

export function getCardPower(state: MatchState, instanceId: string): number {
  const evaluating = getEvaluatingCardPower(state, instanceId);
  if (evaluating !== undefined) return evaluating;
  const settled = settledContinuousPower(state, instanceId);
  if (settled !== undefined) return settled;
  const instance = getInstance(state, instanceId);
  const card = getCard(instance.cardId);
  return (
    (getSetBasePower(state, instanceId) ?? basePower(card)) +
    (state.activeSeat === instance.controller ? instance.attachedDon * 1000 : 0) +
    getPowerModifierTotal(state, instanceId) +
    getPermanentModifierTotal(state, instanceId, "power")
  );
}

export function getCardAttribute(state: MatchState, instanceId: string): string[] {
  const card = getCard(getInstance(state, instanceId).cardId);
  const base: string[] = Array.isArray(card.attribute)
    ? card.attribute
    : card.attribute
      ? [card.attribute]
      : [];
  const granted: string[] = [];
  for (const modifier of Object.values(state.modifiers)) {
    if (modifier.type === "attribute" && modifier.targetId === instanceId && modifier.attribute) {
      granted.push(modifier.attribute);
    }
  }
  // CR 2-5-2 lists six attributes, including the literal "?".
  const rulesAttributes =
    card.cardType === "leader" && card.rulesIdentity?.allAttributes
      ? ["strike", "slash", "ranged", "wisdom", "special", "?"]
      : [];
  return [...new Set([...base, ...rulesAttributes, ...granted])];
}

/** Raw base setting for arithmetic; negative costs remain negative within calculations. */
export function getSetBaseCost(state: MatchState, instanceId: string): number | null {
  const permanent = getPermanentSetBaseCost(state, instanceId);
  const resolved = getResolvedSetBaseCost(state, instanceId);
  return permanent === null
    ? resolved
    : resolved === null
      ? permanent
      : Math.max(permanent, resolved);
}

/** Resolved settings are fixed settlement inputs, unlike live permanent settings. */
export function getResolvedSetBaseCost(state: MatchState, instanceId: string): number | null {
  let value: number | null = null;
  const generation = getInstance(state, instanceId).zoneChangeCounter;
  for (const modifier of Object.values(state.modifiers)) {
    if (
      modifier.type !== "baseCost" ||
      modifier.targetId !== instanceId ||
      modifier.baseCostTargetGeneration !== generation
    )
      continue;
    const next = modifier.value ?? 0;
    value = value === null ? next : Math.max(value, next);
  }
  return value;
}

/** Observable base cost excludes additive changes and current-cost settings. */
export function getBaseCost(state: MatchState, instanceId: string): number {
  const evaluating = getEvaluatingBaseCost(state, instanceId);
  if (evaluating !== undefined) return Math.max(0, evaluating);
  const settled = settledContinuousBaseCost(state, instanceId);
  if (settled !== undefined) return Math.max(0, settled);
  return Math.max(
    0,
    getSetBaseCost(state, instanceId) ?? baseCost(getCardForInstance(state, instanceId)),
  );
}

export function getCardCost(state: MatchState, instanceId: string): number {
  const evaluating = getEvaluatingCardCost(state, instanceId);
  if (evaluating !== undefined) return evaluating;
  // OP03-091's resolved cost setting remains absolute for its duration,
  // including when a continuous reduction such as Kuzan leaves the field.
  // Unlike setting power to 0 (4-12), it is not a snapshot subtraction.
  const resolvedSettings = Object.values(state.modifiers).filter(
    (modifier) => modifier.targetId === instanceId && modifier.type === "setCost",
  );
  const resolvedSetting = resolvedSettings.at(-1);
  const setCost = resolvedSetting?.value ?? getPermanentSetCost(state, instanceId);
  if (setCost !== null) return Math.max(0, setCost);
  const settled = settledContinuousCost(state, instanceId);
  if (settled !== undefined) return settled;
  const instance = getInstance(state, instanceId);
  const card = getCard(instance.cardId);
  return getContinuousCardCost(
    state,
    instanceId,
    getSetBaseCost(state, instanceId) ?? baseCost(card),
    getCostModifierTotal(state, instanceId),
  );
}

/** Pending play discounts change payment, not the card's cost characteristic. */
export function nextPlayCostModifiers(state: MatchState, instanceId: string): ModifierState[] {
  return Object.values(state.modifiers).filter((modifier) => {
    const pending = modifier.nextPaidPlay;
    if (!pending || getInstance(state, instanceId).zone !== "hand") return false;
    const pool = candidatePoolForTarget(
      state,
      pending.controller,
      modifier.sourceInstanceId,
      pending.target,
    );
    return pool.supported && pool.candidateIds.includes(instanceId);
  });
}

export function getPaidPlayCost(state: MatchState, instanceId: string): number {
  return Math.max(
    0,
    getCardCost(state, instanceId) +
      getPermanentModifierTotal(state, instanceId, "playCost") +
      nextPlayCostModifiers(state, instanceId).reduce(
        (total, modifier) => total + (modifier.value ?? 0),
        0,
      ),
  );
}
