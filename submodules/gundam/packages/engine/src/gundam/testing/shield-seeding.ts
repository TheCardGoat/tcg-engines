import type { BaseCard } from "@tcg/gundam-types";
import { asPlayerId } from "../../types/branded.ts";
import { createMockResource } from "./card-mocks.ts";
import type { GundamPlayerId, GundamTestEngine } from "./test-engine.ts";

/**
 * Seed `count` cards from the top of `playerId`'s deck into their shield area.
 *
 * Used by unit/pilot tests that need a shield card whose 【Burst】 should fire
 * when a direct attack destroys it.
 *
 * NOTE: this helper mutates `ctx.zones.private` / `ctx.zones.public` directly
 * because there is no public engine move for "move-without-shuffle from deck
 * to shield". `engine.giveCard(..., { zone: "shieldArea" })` would create a
 * brand-new card instance (no `registerCardInstance` hook for the existing
 * deck entry) and `setupShields` during match init draws from the deck in
 * engine-order, not letting the test decide which card lands on top.
 *
 * If/when the engine exposes a dedicated "seed shields from deck head" helper
 * we should migrate to it. Until then the mutation is scoped to this helper
 * so the call sites stay typed.
 */
export function seedShieldsFromDeck(
  engine: GundamTestEngine,
  playerId: GundamPlayerId,
  count: number,
): string[] {
  const state = engine.getState();
  const priv = state.ctx.zones.private;
  const pub = state.ctx.zones.public as {
    zoneSummaries?: Record<string, { count?: number; revision?: number }>;
  };
  const deckKey = `deck:${playerId}`;
  const shieldKey = `shieldArea:${playerId}`;
  const deck = priv.zoneCards[deckKey] ?? [];
  const shields = priv.zoneCards[shieldKey] ?? (priv.zoneCards[shieldKey] = []);
  const moved: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = deck.shift();
    if (!id) break;
    shields.push(id);
    const e = priv.cardIndex[id];
    if (e) {
      e.zoneKey = shieldKey;
      e.index = shields.length - 1;
    }
    moved.push(id);
  }
  for (let i = 0; i < deck.length; i++) {
    const e = priv.cardIndex[deck[i]!];
    if (e) e.index = i;
  }
  const sync = (k: string, len: number) => {
    const s = pub.zoneSummaries?.[k];
    if (s) {
      s.count = len;
      s.revision = (s.revision ?? 0) + 1;
    } else if (pub.zoneSummaries) {
      pub.zoneSummaries[k] = { count: len, revision: 1 };
    }
  };
  sync(deckKey, deck.length);
  sync(shieldKey, shields.length);
  return moved;
}

/**
 * Give `playerId` a fresh mock-resource card in their shield area.
 *
 * Used by base tests that need a shield-area card to move into hand when the
 * base's 【Deploy】 triggers addShieldToHand. Unlike `seedShieldsFromDeck` this
 * creates a brand-new card instance (so it doesn't require a pre-populated
 * deck) and registers it with the runtime.
 */
export function giveShield(engine: GundamTestEngine, playerId: GundamPlayerId): string {
  const card = createMockResource();
  const branded = asPlayerId(playerId);
  const instanceId = engine.giveCard(branded, card.cardNumber, {
    zone: "shieldArea",
    playerId: branded,
  });
  engine.getRuntime().registerCardInstance(instanceId, card.cardNumber, branded);
  return instanceId;
}

/**
 * Seed a base card into `playerId`'s shieldArea and register its runtime
 * definition. Returns the shield instance id so tests can call
 * `engine.fireShieldBurst(shieldId)` to exercise 【Burst】Deploy this card.
 */
export function seedBaseAsShield(
  engine: GundamTestEngine,
  playerId: GundamPlayerId,
  baseCard: BaseCard,
): string {
  const state = engine.getState();
  const priv = state.ctx.zones.private;
  const pub = state.ctx.zones.public as {
    zoneSummaries?: Record<string, { count?: number; revision?: number }>;
  };
  const deckKey = `deck:${playerId}`;
  const shieldKey = `shieldArea:${playerId}`;
  const deck = priv.zoneCards[deckKey] ?? [];
  const shieldId = deck.shift();
  if (!shieldId) throw new Error("seedBaseAsShield: deck was empty");

  for (const [index, cardId] of deck.entries()) {
    const deckEntry = priv.cardIndex[cardId];
    if (deckEntry) deckEntry.index = index;
  }

  (priv.zoneCards[shieldKey] ??= []).push(shieldId);
  const e = priv.cardIndex[shieldId]!;
  e.zoneKey = shieldKey;
  e.index = priv.zoneCards[shieldKey]!.length - 1;
  if (pub.zoneSummaries) {
    const deckSummary = (pub.zoneSummaries[deckKey] ??= {});
    deckSummary.count = deck.length;
    deckSummary.revision = (deckSummary.revision ?? 0) + 1;

    const shieldSummary = (pub.zoneSummaries[shieldKey] ??= {});
    shieldSummary.count = priv.zoneCards[shieldKey]!.length;
    shieldSummary.revision = (shieldSummary.revision ?? 0) + 1;
  }
  engine.getRuntime().registerCardInstance(shieldId, baseCard.cardNumber, asPlayerId(playerId));
  return shieldId;
}
