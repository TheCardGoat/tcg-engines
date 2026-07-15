/**
 * Build a `MatchRuntime` seeded with two real decklists for self-play.
 *
 * The simulator app does this through `createDevRuntime` + `createMatchFromDecks`,
 * but those modules pull in app-internal viewer/SSR types. Replicating the
 * minimal placement logic here keeps the bench a pure Node script with only
 * engine + cards as deps.
 */

import {
  MatchRuntime,
  asPlayerId,
  createStaticResources,
  expandDeck,
  type DeckList,
  type GundamCardMeta,
  type MatchStaticResources,
  type Player,
  type PlayerId,
} from "@tcg/gundam-engine";
import * as GundamCards from "@tcg/gundam-cards";
import { exbpExBase001, exrpExResource003 } from "@tcg/gundam-cards";
import type { Card } from "@tcg/gundam-types";

export const PLAYER_ONE: PlayerId = asPlayerId("player_one");
export const PLAYER_TWO: PlayerId = asPlayerId("player_two");

let instanceCounter = 0;

/**
 * Build a `Record<cardNumber, Card>` from every card the cards package exports.
 */
function buildCatalog(): Map<string, Card> {
  const catalog = new Map<string, Card>();
  for (const value of Object.values(GundamCards)) {
    if (
      value &&
      typeof value === "object" &&
      "cardNumber" in value &&
      typeof (value as { cardNumber: unknown }).cardNumber === "string"
    ) {
      const card = value as Card;
      catalog.set(card.cardNumber, card);
    }
  }
  catalog.set(exbpExBase001.cardNumber, exbpExBase001);
  catalog.set(exrpExResource003.cardNumber, exrpExResource003);
  return catalog;
}

const SHARED_CATALOG = buildCatalog();

/** Insert one card into a player's deck or resource-deck zone. */
function placeCard(
  runtime: MatchRuntime,
  playerId: PlayerId,
  card: Card,
  zone: "deck" | "resourceDeck",
): void {
  const state = runtime.getState();
  const instanceId = `${playerId}_${card.cardNumber}_${++instanceCounter}`;
  runtime.registerCardInstance(instanceId, card.cardNumber, playerId);

  const zoneKey = `${zone}:${playerId}`;
  state.ctx.zones.private.zoneCards[zoneKey] ??= [];
  state.ctx.zones.private.zoneCards[zoneKey].push(instanceId);
  state.ctx.zones.private.cardIndex[instanceId] = {
    zoneKey,
    index: state.ctx.zones.private.zoneCards[zoneKey].length - 1,
    ownerID: playerId,
    controllerID: playerId,
  };
  const meta: GundamCardMeta = { exhausted: false };
  state.ctx.zones.private.cardMeta[instanceId] = meta;

  state.ctx.zones.public.zoneSummaries[zoneKey] ??= { revision: 0, count: 0 };
  state.ctx.zones.public.zoneSummaries[zoneKey].count++;
  state.ctx.zones.public.zoneSummaries[zoneKey].revision++;
}

export interface BenchRuntimeOptions {
  readonly p1Deck: DeckList;
  readonly p2Deck: DeckList;
  readonly seed: string;
  /** Defaults to `player_one`. */
  readonly initialActivePlayer?: PlayerId;
}

export interface BenchRuntimeHandle {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
}

/**
 * Build a fully-seeded runtime: catalog merged, decks expanded and placed,
 * setup phase ready. The runtime is in `choose-first-player` — `playMatch`
 * drives both seats through the setup flow before main phase begins.
 */
export function buildBenchRuntime(options: BenchRuntimeOptions): BenchRuntimeHandle {
  // Keep headless bot-bench instance IDs stable across multiple same-process
  // runs. The simulator dev runtime has its own counter/reset because this
  // package deliberately avoids importing app internals.
  instanceCounter = 0;
  const p1Expanded = expandDeck(options.p1Deck, { catalog: SHARED_CATALOG });
  const p2Expanded = expandDeck(options.p2Deck, { catalog: SHARED_CATALOG });

  const p1: Player = {
    id: PLAYER_ONE,
    name: "Player One",
    deck: p1Expanded.deck.map((c) => c.cardNumber),
    resourceDeck: p1Expanded.resourceDeck.map((c) => c.cardNumber),
  };
  const p2: Player = {
    id: PLAYER_TWO,
    name: "Player Two",
    deck: p2Expanded.deck.map((c) => c.cardNumber),
    resourceDeck: p2Expanded.resourceDeck.map((c) => c.cardNumber),
  };

  const staticResources = createStaticResources([p1, p2], SHARED_CATALOG);
  const runtime = new MatchRuntime(staticResources);
  runtime.initialize([p1, p2], options.seed, options.initialActivePlayer ?? PLAYER_ONE);

  for (const card of p1Expanded.deck) placeCard(runtime, PLAYER_ONE, card, "deck");
  for (const card of p1Expanded.resourceDeck) placeCard(runtime, PLAYER_ONE, card, "resourceDeck");
  for (const card of p2Expanded.deck) placeCard(runtime, PLAYER_TWO, card, "deck");
  for (const card of p2Expanded.resourceDeck) placeCard(runtime, PLAYER_TWO, card, "resourceDeck");

  return { runtime, staticResources };
}

// ── Registered decks ──────────────────────────────────────────────────────────
// Bench-owned deck fixtures. They're pure data modules, so
// node --experimental-strip-types can load them without pulling in UI code.

import { earthFederationStarter } from "./decks/earth-federation-starter.ts";
import { seedAggro } from "./decks/seed-aggro.ts";
import { gd01Mixed } from "./decks/gd01-mixed.ts";

export type BenchDeckId = "ef-starter" | "seed-aggro" | "gd01-mixed";

export const REGISTERED_DECKS: Readonly<Record<BenchDeckId, DeckList>> = {
  "ef-starter": earthFederationStarter,
  "seed-aggro": seedAggro,
  "gd01-mixed": gd01Mixed,
};
