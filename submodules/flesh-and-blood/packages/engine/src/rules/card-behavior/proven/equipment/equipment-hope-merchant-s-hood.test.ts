/**
 * TEA004 Hope Merchant's Hood — Generic Head d0.
 *
 * Printed:
 *   Instant - Destroy this: Shuffle any number of cards from your hand into
 *   your deck, then draw that many cards.
 *
 * Reasoning (hand-authored):
 * 1. Instant destroy-self cost removes head to GY.
 * 2. "any number" needs upTo on star count (was mandatory all).
 * 3. move-card→deck stamps shuffled-this-way cardinality; draw amount reads it
 *    (was evaluateCount throw on shuffled-this-way).
 * 4. Choose 2 of 2 hand → shuffle into deck → draw 2 (hand size preserved).
 * 5. Choose 0 of hand → destroy only, hand unchanged.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { hopeMerchantSHood } from "../../../../../../cards/src/cards/equipment/hope-merchant-s-hood.ts";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { pickCount?: number } = {},
): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const n = opts.pickCount ?? decision.candidates.length;
      const picks = decision.candidates.slice(0, Math.max(0, n)).map((c) => c.instanceId);
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
        },
      });
      continue;
    }
    if (decision) break;
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("hope-merchant-s-hood (TEA004)", () => {
  it("core mechanic: Instant destroy → shuffle chosen hand cards → draw that many", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [hopeMerchantSHood],
        hand: [snatchRed, nimblismBlue],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.zone("hand").length;
    expect(handBefore).toBe(2);

    Bravo.activate(hopeMerchantSHood);
    // Choose both hand cards to shuffle.
    drain(game, { pickCount: 2 });

    expect(Bravo.zone("head")).not.toContain(hopeMerchantSHood.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(hopeMerchantSHood.canonicalId);
    // Drew as many as shuffled → hand size restored to 2.
    expect(Bravo.zone("hand").length).toBe(2);
  });

  it("boundaries: empty hand → destroy only (no draw); model upTo + shuffled-this-way", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [hopeMerchantSHood],
        hand: [],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(hopeMerchantSHood);
    drain(game, { pickCount: 0 });

    expect(Bravo.zone("head")).not.toContain(hopeMerchantSHood.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(hopeMerchantSHood.canonicalId);
    // Nothing shuffled → no draw.
    expect(Bravo.zone("hand").length).toBe(0);
    expect(Bravo.zone("deck").length).toBe(deckBefore);

    const a1 = hopeMerchantSHood.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                zones: ["hand"],
                count: { type: "any-number" },
              },
              to: { zone: "deck" },
            },
            { type: "shuffle", zone: "deck" },
          ],
        },
        {
          type: "draw",
          count: { type: "count", what: "shuffled-this-way" },
          player: "controller",
        },
      ],
    });
    expect(hopeMerchantSHood.base.numeric.defense).toBe(0);
  });
});
