/**
 * `millDeck` EffectAction — "Place the top N cards of X's deck into X's trash."
 *
 * Covers owner resolution (`self` vs `opponent`) + the short-deck safety
 * behaviour (clamp to remaining deck size, never crash). Printed-card
 * anchor: Freeden (GD02-127) 【Destroyed】 mills 2 of your own deck.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, expectSuccess } from "../../index.ts";
import type { PendingEffect } from "../types.ts";

function millEffect(count: number, owner: "self" | "opponent"): CardEffect {
  return {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [{ action: { action: "millDeck", count, owner } }],
    sourceText: `Place the top ${count} cards of ${owner} deck into trash.`,
  };
}

let peIdCounter = 0;
function makePending(
  overrides: Partial<PendingEffect> & Pick<PendingEffect, "effect" | "controllerId">,
): PendingEffect {
  return {
    id: overrides.id ?? `mill_${++peIdCounter}`,
    sourceCardId: overrides.sourceCardId ?? "unused",
    effectIndex: overrides.effectIndex ?? 0,
    kind: overrides.kind ?? "activated",
    ...overrides,
  };
}

describe("executor — millDeck", () => {
  it("owner=self mills the source controller's deck into their trash", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, { deck: 10 });
    const p1DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const p1TrashBefore = engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE });
    const p2DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO });

    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: millEffect(3, "self"), controllerId: PLAYER_ONE }),
      );
    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(p1DeckBefore - 3);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(p1TrashBefore + 3);
    // Opponent deck untouched.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO })).toBe(p2DeckBefore);
  });

  it("owner=opponent mills the opposing player's deck into their trash", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, { deck: 10 });
    const p1DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const p2DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO });
    const p2TrashBefore = engine.getCardCount({ zone: "trash", playerId: PLAYER_TWO });

    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: millEffect(2, "opponent"), controllerId: PLAYER_ONE }),
      );
    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO })).toBe(p2DeckBefore - 2);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_TWO })).toBe(p2TrashBefore + 2);
    // Source controller's own deck untouched.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(p1DeckBefore);
  });

  it("clamps count to remaining deck size (no crash on short / empty deck)", () => {
    // Deck size 1, request mill 5 — should mill just the one remaining card
    // and leave the deck empty without throwing.
    const engine = GundamTestEngine.create({ deck: 1 }, {});
    const p1TrashBefore = engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE });

    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: millEffect(5, "self"), controllerId: PLAYER_ONE }),
      );
    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(0);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(p1TrashBefore + 1);
  });
});
