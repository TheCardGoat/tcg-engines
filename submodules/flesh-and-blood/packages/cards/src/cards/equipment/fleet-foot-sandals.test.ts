import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { infectBlue } from "../actions/infect.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fleetFootSandals } from "./fleet-foot-sandals.ts";

describe("Fleet Foot Sandals (BEN006) AAA", () => {
  it("happy: destroy this so a base-1 attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [fleetFootSandals],
        hand: [infectBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.attackWith(infectBlue);
    game.advanceCombatTo("reaction");
    Uzuri.activate(fleetFootSandals);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Uzuri, fleetFootSandals).toBeIn("graveyard");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Uzuri).toHaveAP(1);
  });

  it("boundary: a base-4 attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [fleetFootSandals],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.expectActivationRejected(fleetFootSandals);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Bravo, fleetFootSandals).toBeIn("legs");
  });

  it("timing: the Attack Reaction is illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [fleetFootSandals],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(uzuri).expectActivationRejected(fleetFootSandals);
    expectFabCard(game.as(uzuri), fleetFootSandals).toBeIn("legs");
  });
});
