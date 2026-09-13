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
import { shelteredCove } from "./sheltered-cove.ts";

describe("Sheltered Cove (HVY197) AAA", () => {
  it("happy: Instant 3{r} destroy this prevents 2 of the next damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, head: [shelteredCove], resourcePoints: 3, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.toReaction("defender");
    Bravo.activate(shelteredCove);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, shelteredCove).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: 2{r} cannot activate", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [shelteredCove], resourcePoints: 2, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).expectActivationRejected(shelteredCove);
    expectFabCard(game.as(bravo), shelteredCove).toBeIn("head");
  });

  it("timing: prevention expires at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [shelteredCove], resourcePoints: 3, hand: [], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(shelteredCove);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, shelteredCove).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(16);
  });
});
