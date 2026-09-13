import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { quickdodgeFlexors } from "./quickdodge-flexors.ts";

describe("Quickdodge Flexors (HNT215) AAA", () => {
  it("happy: DR {r} adds this as a 2{d} defender", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [quickdodgeFlexors], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    game.toReaction("defender");
    Dash.activate(quickdodgeFlexors);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, quickdodgeFlexors).toBeIn("legs");
  });

  it("boundary: 0{r} cannot activate the Defense Reaction", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [quickdodgeFlexors], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    game.toReaction("defender");
    Dash.expectActivationRejected(quickdodgeFlexors);
    expectFabCard(Dash, quickdodgeFlexors).toBeIn("legs");
  });

  it("timing: if it defended, it is destroyed at the end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [quickdodgeFlexors], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    Dash.activate(quickdodgeFlexors);
    game.helpers.resolveRestOfCombat();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, quickdodgeFlexors).toBeIn("graveyard");
  });
});
