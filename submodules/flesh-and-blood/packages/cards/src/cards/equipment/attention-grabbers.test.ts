import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { actOfGloryBlue } from "../instants/act-of-glory.ts";
import { attentionGrabbers } from "./attention-grabbers.ts";

/**
 * Attention Grabbers (APS006) — Guardian Arms, Blade Break.
 * Printed: "When this defends, you may remove a suspense counter from an aura
 * you control. If you do, this gets +2{d} this chain link."
 * Act of Glory (a real Suspense aura) enters the arena with suspense counters.
 */

describe("Attention Grabbers (APS006) AAA", () => {
  it("happy: removing a suspense counter from the aura gives +2{d} on the link", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [attentionGrabbers],
        hand: [actOfGloryBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(actOfGloryBlue);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(attentionGrabbers);
    // Drain to the aura-target decision, then name the Suspense aura.
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Bravo.target(actOfGloryBlue);

    // 1{d} printed + 2{d} from the removed suspense counter holds Snatch to 1.
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("boundary: declining the optional leaves the printed 1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [attentionGrabbers],
        hand: [actOfGloryBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(actOfGloryBlue);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(attentionGrabbers);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(17);
  });
});
