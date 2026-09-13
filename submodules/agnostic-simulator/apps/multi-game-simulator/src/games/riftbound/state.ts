import type { CardsMaps } from "@tcg/shared/game-adapter";
import type {
  SimulatorActivityEntry,
  SimulatorStatement,
  SimulatorStatementAction,
} from "@tcg/simulator-contract";
import { appendSimulatorActivity, reduceSimulatorStatements } from "@tcg/simulator-runtime";

export type RiftboundZone =
  | "deck"
  | "hand"
  | "play"
  | "discard"
  | "legend"
  | "battlefields"
  | "runes";

export interface RiftboundClientCardV1 {
  id: string;
  cardId: string;
  ownerId: string;
  zone: RiftboundZone;
  face: "up" | "down";
  rotation: 0 | 90 | 180 | 270;
  position: { x: number; y: number };
  stackId?: string;
  counters: Record<string, number>;
}

export interface RiftboundClientCardDefinitionV1 {
  name: string;
  cardType: string;
  domains: string[];
  imageUrl?: string;
}

export type RiftboundStatementV1 = SimulatorStatement;

export type RiftboundActivityV1 = SimulatorActivityEntry;

export interface RiftboundClientMatchStateV1 {
  schemaVersion: 1;
  players: [string, string];
  cards: Record<string, RiftboundClientCardV1>;
  cardDefinitions: Record<string, RiftboundClientCardDefinitionV1>;
  zoneOrder: Record<string, string[]>;
  statements: RiftboundStatementV1[];
  spotlightStatementId?: string;
  activity: RiftboundActivityV1[];
  terminal?: { winnerId?: string; reason: string; endedAt: number };
}

export interface RiftboundClientSnapshotV1 {
  state: RiftboundClientMatchStateV1 | null;
  cardsMaps?: CardsMaps;
}

interface ActionBase {
  actorId: string;
  actionId: string;
  at: number;
}

export type RiftboundClientMatchActionV1 =
  | (ActionBase & {
      type: "move_card";
      cardId: string;
      zone: RiftboundZone;
      x?: number;
      y?: number;
      stackId?: string;
    })
  | (ActionBase & { type: "set_face"; cardId: string; face: "up" | "down" })
  | (ActionBase & { type: "rotate"; cardId: string; rotation: 0 | 90 | 180 | 270 })
  | (ActionBase & { type: "set_counter"; cardId: string; counter: string; value: number })
  | (ActionBase & { type: "shuffle"; ownerId: string; zone: RiftboundZone; order: string[] })
  | (ActionBase & { type: "draw"; ownerId: string; count: number })
  | SimulatorStatementAction
  | (ActionBase & { type: "end_game"; winnerId?: string; reason: string });

export type RiftboundClientMatchActionInputV1 = {
  [Type in RiftboundClientMatchActionV1["type"]]: Omit<
    Extract<RiftboundClientMatchActionV1, { type: Type }>,
    keyof ActionBase
  >;
}[RiftboundClientMatchActionV1["type"]];

export function createRiftboundClientMatchStateV1(
  players: [string, string],
  cardsMaps: CardsMaps,
  cardDefinitions: Record<string, RiftboundClientCardDefinitionV1>,
): RiftboundClientMatchStateV1 {
  const cards: Record<string, RiftboundClientCardV1> = {};
  const zoneOrder: Record<string, string[]> = {};
  for (const playerId of players) {
    for (const instanceId of cardsMaps.owners[playerId] ?? []) {
      const cardId = cardsMaps.cardInstances[instanceId];
      if (!cardId) continue;
      const zone = initialZone(cardDefinitions[cardId]);
      cards[instanceId] = {
        id: instanceId,
        cardId,
        ownerId: playerId,
        zone,
        face: zone === "deck" || zone === "runes" ? "down" : "up",
        rotation: 0,
        position: { x: 0, y: 0 },
        counters: {},
      };
      zoneList(zoneOrder, playerId, zone).push(instanceId);
    }
  }
  return {
    schemaVersion: 1,
    players,
    cards,
    cardDefinitions,
    zoneOrder,
    statements: [],
    activity: [],
  };
}

export function reduceRiftboundClientMatchStateV1(
  state: RiftboundClientMatchStateV1,
  action: RiftboundClientMatchActionV1,
): RiftboundClientMatchStateV1 {
  if (state.terminal && action.type !== "end_game") return state;
  switch (action.type) {
    case "publish_statement":
    case "withdraw_statement":
    case "acknowledge_statement":
    case "spotlight_statement":
      return reduceSimulatorStatements(state, action);
  }

  const next = structuredClone(state);
  let summary = action.type.replaceAll("_", " ");
  switch (action.type) {
    case "move_card": {
      const card = requireOwnedCard(next, action.cardId, action.actorId);
      removeFromZone(next, card);
      card.zone = action.zone;
      card.position = { x: action.x ?? 0, y: action.y ?? 0 };
      card.stackId = action.stackId;
      zoneList(next.zoneOrder, card.ownerId, card.zone).push(card.id);
      summary = `moved a card to ${action.zone}`;
      break;
    }
    case "set_face":
      requireOwnedCard(next, action.cardId, action.actorId).face = action.face;
      break;
    case "rotate":
      requireOwnedCard(next, action.cardId, action.actorId).rotation = action.rotation;
      break;
    case "set_counter": {
      const card = requireOwnedCard(next, action.cardId, action.actorId);
      if (action.value === 0) delete card.counters[action.counter];
      else card.counters[action.counter] = action.value;
      break;
    }
    case "shuffle": {
      requireOwner(action.actorId, action.ownerId);
      const current = zoneList(next.zoneOrder, action.ownerId, action.zone);
      if (
        current.length !== action.order.length ||
        action.order.some((id) => !current.includes(id))
      ) {
        throw new Error("Shuffle order must contain exactly the cards in the zone");
      }
      next.zoneOrder[zoneKey(action.ownerId, action.zone)] = [...action.order];
      break;
    }
    case "draw": {
      requireOwner(action.actorId, action.ownerId);
      for (let count = 0; count < action.count; count += 1) {
        const id = zoneList(next.zoneOrder, action.ownerId, "deck").at(-1);
        if (!id) break;
        const card = requireCard(next, id);
        removeFromZone(next, card);
        card.zone = "hand";
        card.face = "up";
        zoneList(next.zoneOrder, action.ownerId, "hand").push(id);
      }
      summary = `drew ${action.count} card${action.count === 1 ? "" : "s"}`;
      break;
    }
    case "end_game":
      if (action.winnerId && !next.players.includes(action.winnerId))
        throw new Error("Winner must be seated");
      next.terminal ??= {
        winnerId: action.winnerId,
        reason: action.reason.slice(0, 200),
        endedAt: action.at,
      };
      break;
  }
  return appendSimulatorActivity(next, {
    id: action.actionId,
    actorId: action.actorId,
    at: action.at,
    summary,
  });
}

export function isRiftboundClientMatchStateV1(
  value: unknown,
): value is RiftboundClientMatchStateV1 {
  return Boolean(
    value &&
    typeof value === "object" &&
    (value as { schemaVersion?: unknown }).schemaVersion === 1 &&
    Array.isArray((value as { players?: unknown }).players) &&
    Boolean((value as { cardDefinitions?: unknown }).cardDefinitions),
  );
}

export function parseRiftboundClientSnapshotV1(value: unknown): RiftboundClientSnapshotV1 | null {
  let decoded = value;
  if (typeof decoded === "string") {
    try {
      decoded = JSON.parse(decoded) as unknown;
    } catch {
      return null;
    }
  }
  if (isRiftboundClientMatchStateV1(decoded)) return { state: decoded };
  if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) return null;

  const envelope = decoded as { state?: unknown; cardsMaps?: unknown };
  let nestedState = envelope.state;
  if (typeof nestedState === "string") {
    try {
      nestedState = JSON.parse(nestedState) as unknown;
    } catch {
      nestedState = null;
    }
  }
  const state = isRiftboundClientMatchStateV1(nestedState) ? nestedState : null;
  const cardsMaps = isCardsMaps(envelope.cardsMaps) ? envelope.cardsMaps : undefined;
  return state || cardsMaps ? { state, ...(cardsMaps ? { cardsMaps } : {}) } : null;
}

function isCardsMaps(value: unknown): value is CardsMaps {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as { cardInstances?: unknown; owners?: unknown };
  return Boolean(
    candidate.cardInstances &&
    typeof candidate.cardInstances === "object" &&
    !Array.isArray(candidate.cardInstances) &&
    candidate.owners &&
    typeof candidate.owners === "object" &&
    !Array.isArray(candidate.owners),
  );
}

function initialZone(definition: RiftboundClientCardDefinitionV1 | undefined): RiftboundZone {
  const type = definition?.cardType.toLocaleLowerCase() ?? "";
  if (type.includes("legend")) return "legend";
  if (type.includes("battlefield")) return "battlefields";
  if (type.includes("rune")) return "runes";
  return "deck";
}

function zoneKey(ownerId: string, zone: RiftboundZone): string {
  return `${ownerId}:${zone}`;
}

function zoneList(order: Record<string, string[]>, ownerId: string, zone: RiftboundZone): string[] {
  return (order[zoneKey(ownerId, zone)] ??= []);
}

function requireCard(state: RiftboundClientMatchStateV1, id: string): RiftboundClientCardV1 {
  const card = state.cards[id];
  if (!card) throw new Error(`Unknown card instance: ${id}`);
  return card;
}

function requireOwnedCard(
  state: RiftboundClientMatchStateV1,
  id: string,
  actorId: string,
): RiftboundClientCardV1 {
  const card = requireCard(state, id);
  requireOwner(actorId, card.ownerId);
  return card;
}

function requireOwner(actorId: string, ownerId: string): void {
  if (actorId !== ownerId) {
    throw new Error("Players can only change their own cards and zones");
  }
}

function removeFromZone(state: RiftboundClientMatchStateV1, card: RiftboundClientCardV1): void {
  const list = zoneList(state.zoneOrder, card.ownerId, card.zone);
  const index = list.indexOf(card.id);
  if (index >= 0) list.splice(index, 1);
}
