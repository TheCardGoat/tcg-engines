/**
 * ARA027 Bloodrot Pox — end-phase destroy + unless-pay-or-damage.
 *
 * Printed: At the beginning of your end phase, destroy Bloodrot Pox, then
 * it deals 2 damage to you unless you pay {r}{r}{r}.
 *
 * Status: ⬜→✅ — trigger, self-destroy, unless-pay escape, and deal-damage
 * proven. Card fix: trigger gains actor:"controller" ("your end phase").
 * Reuses Ponder end-phase + unless-pay + deal-damage primitives.
 * Note: unless-pay resource deduction is not yet in engine; escape path
 * verified via life assertion.
 */
import { describe, expect, it } from "vitest";

import { bloodrotPox } from "../../../../cards/src/cards/tokens/bloodrot-pox.ts";
import {
  createFabMatchContext,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../index.ts";
import { bravo, dash, nimblismRed, pummelRed, sigilOfSolaceRed } from "../../rules/fixtures.ts";

const LIFE = 40;

describe("Bloodrot Pox token (ARA027)", () => {
  const restore = (game: ReturnType<typeof FabTestEngine.start>) => {
    const state = game.getState();
    const snapshot = serializeFabMatchSnapshot(state);
    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    expect(restored.decision).toEqual(snapshot.decision);
    expect(restored.rulesProcess?.effectPaymentPitches).toEqual(
      snapshot.rulesProcess?.effectPaymentPitches,
    );
    return FabTestEngine.fromState(restored);
  };

  it("pitches one exact card at a time across snapshots, then commits pay 3 before suppressing damage", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [bloodrotPox],
        life: LIFE,
        resourcePoints: 0,
        hand: [nimblismRed, pummelRed, sigilOfSolaceRed],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).endTurn();
    game.advanceToDecision(game.as(bravo), "boolean");
    game.as(bravo).chooseBoolean(true);
    expect(game.as(bravo).expectDecision("payment")).toBeDefined();

    for (const card of [nimblismRed, pummelRed, sigilOfSolaceRed]) {
      game = restore(game);
      const payer = game.as(bravo);
      const decision = payer.expectDecision("payment");
      const candidate = decision.candidates.find(
        (entry) => game.getState().objects[entry.instanceId]?.canonicalId === card.canonicalId,
      );
      expect(candidate).toBeDefined();
      game.answerDecision(payer.id, {
        kind: "payment",
        instanceIds: [candidate!.instanceId],
      });
    }
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    const Bravo = game.as(bravo);
    expect(Bravo.life()).toBe(LIFE);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("deck")).toEqual(
      expect.arrayContaining([
        nimblismRed.canonicalId,
        pummelRed.canonicalId,
        sigilOfSolaceRed.canonicalId,
      ]),
    );
    expect(game.committedEvents().filter((event) => event.name === "pay-resources")).toHaveLength(
      1,
    );
  });

  it("cancels a partially selected payment after restore without moving cards or suppressing damage", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [bloodrotPox],
        life: LIFE,
        resourcePoints: 0,
        hand: [nimblismRed, pummelRed, sigilOfSolaceRed],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.endTurn();
    game.advanceToDecision(Bravo, "boolean");
    Bravo.chooseBoolean(true);
    const first = Bravo.expectDecision("payment").candidates[0]!;
    game.answerDecision(Bravo.id, { kind: "payment", instanceIds: [first.instanceId] });
    game = restore(game);
    const Restored = game.as(bravo);
    expect(Restored.expectDecision("payment").cancellable).toBe(true);
    game.answerDecision(Restored.id, { kind: "cancel" });
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(Restored.life()).toBe(LIFE - 2);
    expect(Restored.zone("hand")).toEqual(
      expect.arrayContaining([
        nimblismRed.canonicalId,
        pummelRed.canonicalId,
        sigilOfSolaceRed.canonicalId,
      ]),
    );
    expect(game.committedEvents().filter((event) => event.name === "pitch")).toHaveLength(0);
    expect(game.committedEvents().filter((event) => event.name === "pay-resources")).toHaveLength(
      0,
    );
  });

  it("AAA: destroys at controller's end phase, deals 2 damage without payment", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [bloodrotPox], life: LIFE, resourcePoints: 0, hand: [], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Bravo.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(bloodrotPox.canonicalId);
    expect(Bravo.life()).toBe(lifeBefore - 2);
  });

  it("boundary: paying 3 resources avoids the damage (escape path)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [bloodrotPox], life: LIFE, resourcePoints: 3, deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Bravo.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(bloodrotPox.canonicalId);
    // Had 3 resources — unless-pay escape avoids damage (life unchanged).
    // Note: resource deduction from unless-pay not yet in engine.
    expect(Bravo.life()).toBe(lifeBefore);
  });

  it("boundary: insufficient resources — damage applies, resources consumed (engine gap)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [bloodrotPox], life: LIFE, resourcePoints: 2, hand: [], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Bravo.endTurn();
    game.passBoth();

    // 2 resources < 3 required — cannot pay, damage applies.
    expect(Bravo.life()).toBe(lifeBefore - 2);
    expect(game.committedEvents().filter((event) => event.name === "pay-resources")).toHaveLength(
      0,
    );
    // Unspent resources clear normally as the end phase completes.
    expect(Bravo.resourcePoints()).toBe(0);
  });
});
