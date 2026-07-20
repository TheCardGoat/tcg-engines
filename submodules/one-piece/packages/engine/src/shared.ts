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
  getPermanentModifierTotal,
  getPermanentSetCost,
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
  return (card.counter ?? 0) + getPermanentModifierTotal(state, instanceId, "counter");
}

export function leaderLife(card: OPCard): number {
  return card.cardType === "leader" ? card.life : 0;
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
  return effectsAreNegated(state, instanceId, trigger)
    ? []
    : effectBlocksFor(getCardForInstance(state, instanceId), trigger);
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
    id: nextIdentifier(state, "res"),
  } as ResolutionItem;
  if (options.next) {
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

  for (const [index, block] of blocks.entries()) {
    const effectKey = block.oncePerTurnKey ?? `${trigger}:${index}`;
    if (block.oncePerTurn && source.usedEffectKeys.includes(effectKey)) {
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
    enqueued += 1;
  }

  return enqueued;
}

export function enqueueInPlayEffectsForTrigger(
  state: MatchState,
  trigger: EffectBlock["trigger"],
  triggerEvent?: Extract<ResolutionItem, { kind: "effectBlock" }>["triggerEvent"],
  sourceControllers?: readonly MatchSeat[],
) {
  for (const source of Object.values(state.cards)) {
    if (sourceControllers && !sourceControllers.includes(source.controller)) {
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
    if (modifier.targetId !== instanceId || modifier.type !== "cost") {
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
    effectsAreNegated(state, instanceId) ? [] : (card.effects?.keywords ?? []),
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

export function getCardPower(state: MatchState, instanceId: string): number {
  const instance = getInstance(state, instanceId);
  const card = getCard(instance.cardId);
  return (
    basePower(card) +
    (state.activeSeat === instance.controller ? instance.attachedDon * 1000 : 0) +
    getPowerModifierTotal(state, instanceId) +
    getPermanentModifierTotal(state, instanceId, "power")
  );
}

export function getCardCost(state: MatchState, instanceId: string): number {
  const instance = getInstance(state, instanceId);
  const card = getCard(instance.cardId);
  const setCost = getPermanentSetCost(state, instanceId);
  return Math.max(
    0,
    (setCost ?? baseCost(card)) +
      getCostModifierTotal(state, instanceId) +
      getPermanentModifierTotal(state, instanceId, "cost"),
  );
}
