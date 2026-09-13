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
import { bloodDropBrocade } from "./blood-drop-brocade.ts";

describe("Blood Drop Brocade (MON238) AAA", () => {
  it("happy: after dealing physical damage, destroy this to gain 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodDropBrocade],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    Bravo.activate(bloodDropBrocade);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, bloodDropBrocade).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("boundary: cannot activate before any physical damage this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodDropBrocade],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(bloodDropBrocade);
    expectFabCard(game.as(bravo), bloodDropBrocade).toBeIn("chest");
  });

  it("timing: after being dealt physical damage, Instant destroy still gains 1 resource", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        chest: [bloodDropBrocade],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    game.helpers.passPriorityTo(Bravo);

    Bravo.activate(bloodDropBrocade);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, bloodDropBrocade).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });
});
