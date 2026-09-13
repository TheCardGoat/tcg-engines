import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crouchingTiger } from "../actions/crouching-tiger.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bloodScent } from "./blood-scent.ts";

describe("Blood Scent (TCC080) AAA", () => {
  it("happy: after attacking with Crouching Tiger, destroy this to gain 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodScent],
        hand: [crouchingTiger],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(crouchingTiger);
    game.helpers.resolveRestOfCombat();

    Bravo.activate(bloodScent);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, bloodScent).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("boundary: a non-Crouching-Tiger attack does not unlock the activation", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodScent],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    Bravo.expectActivationRejected(bloodScent);
    expectFabCard(Bravo, bloodScent).toBeIn("chest");
  });

  it("timing: Battleworn d1 stays seated after defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, chest: [bloodScent], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(bloodScent);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, bloodScent).toBeIn("chest");
    expectFabCard(Bravo, bloodScent).toHaveDefenseCounters(-1);
    expectFabPlayer(Bravo).toHaveLife(17);
  });
});
