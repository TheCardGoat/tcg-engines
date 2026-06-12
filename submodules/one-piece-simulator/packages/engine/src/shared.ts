import { getCard } from "../../cards/src/index.ts";
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

export function leaderLife(card: OPCard): number {
  return card.cardType === "leader" ? card.life : 0;
}

export function effectBlocksFor(card: OPCard, trigger: EffectBlock["trigger"]): EffectBlock[] {
  return card.effects?.effects?.filter((block) => block.trigger === trigger) ?? [];
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

export function enqueueResolution(state: MatchState, item: ResolutionItemInput): ResolutionItem {
  const nextItem = {
    ...item,
    id: nextIdentifier(state, "res"),
  } as ResolutionItem;
  state.resolutionQueue.push(nextItem);
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

export function getKeywords(state: MatchState, instanceId: string): Set<Keyword> {
  const card = getCardForInstance(state, instanceId);
  const keywords = new Set<Keyword>(card.effects?.keywords ?? []);

  for (const modifier of Object.values(state.modifiers)) {
    if (modifier.targetId !== instanceId || modifier.type !== "keyword" || !modifier.keyword) {
      continue;
    }

    keywords.add(modifier.keyword);
  }

  return keywords;
}

export function getCardPower(state: MatchState, instanceId: string): number {
  const instance = getInstance(state, instanceId);
  const card = getCard(instance.cardId);
  return basePower(card) + instance.attachedDon * 1000 + getPowerModifierTotal(state, instanceId);
}

export function getCardCost(state: MatchState, instanceId: string): number {
  const instance = getInstance(state, instanceId);
  const card = getCard(instance.cardId);
  return baseCost(card) + getCostModifierTotal(state, instanceId);
}
