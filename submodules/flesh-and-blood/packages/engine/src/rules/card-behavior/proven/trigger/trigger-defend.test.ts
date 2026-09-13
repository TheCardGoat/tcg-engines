/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:defend
 * Representative card: packages/cards/src/cards/equipment/tricorn-of-saltwater-death.ts
 * Canonical id: hBqjdnFmnpdFC8wpQGgfB
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { tricornOfSaltwaterDeath } from "../../../../../../cards/src/cards/equipment/tricorn-of-saltwater-death.ts";
import { goldenSkullYellow } from "../../../../../../cards/src/cards/actions/golden-skull.ts";
import { blues, bravo, dash, snatchRed } from "../../../fixtures.ts";

describe("trigger: defend", () => {
  it("AAA: Tricorn defending offers the watery-grave discard to draw (CR 6.6.1, 7.3.2)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [tricornOfSaltwaterDeath],
        hand: [goldenSkullYellow, ...blues(2)],
        deck: 4,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const defender = game.as(bravo);
    const handBefore = defender.handCount();

    game.as(dash).attackWith(snatchRed);
    defender.defendWith(tricornOfSaltwaterDeath);
    game.passBoth(); // resolve the declared triggered layer (CR 6.6.6).

    // CR 6.6.5: the defend trigger surfaces the optional discard choice.
    const choice = game.getState().decision;
    expect(choice?.kind).toBe("boolean");
    defender.exec({
      move: "answer-decision",
      payload: {
        decisionId: choice!.decisionId,
        stateVersion: choice!.stateVersion,
        answer: { kind: "boolean", value: true },
      },
    });
    game.helpers.resolveRestOfCombat();

    expectFabCard(defender, goldenSkullYellow).toBeIn("graveyard");
    // Discarded one, drew one — net hand size unchanged.
    expectFabPlayer(defender).toHaveHandCount(handBefore);
    expectCombat(game).toBeClosed();
  });

  it("AAA boundary: declining the discard leaves the hand untouched", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [tricornOfSaltwaterDeath],
        hand: [goldenSkullYellow, ...blues(2)],
        deck: 4,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const defender = game.as(bravo);
    const handBefore = defender.handCount();

    game.as(dash).attackWith(snatchRed);
    defender.defendWith(tricornOfSaltwaterDeath);
    game.passBoth(); // resolve the declared triggered layer (CR 6.6.6).

    const choice = game.getState().decision;
    expect(choice?.kind).toBe("boolean");
    defender.exec({
      move: "answer-decision",
      payload: {
        decisionId: choice!.decisionId,
        stateVersion: choice!.stateVersion,
        answer: { kind: "boolean", value: false },
      },
    });
    game.helpers.resolveRestOfCombat();

    expectFabCard(defender, goldenSkullYellow).toBeIn("hand");
    expectFabPlayer(defender).toHaveHandCount(handBefore);
    // 20 life - (4 power - 1 defense) = 17; no draw replacement.
    expectFabPlayer(defender).toHaveLife(17);
  });
});
