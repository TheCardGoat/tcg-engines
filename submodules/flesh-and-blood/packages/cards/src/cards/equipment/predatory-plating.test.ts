import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { predatoryPlating } from "./predatory-plating.ts";

describe("Predatory Plating (PEN003) AAA", () => {
  it("happy: while a 6{p} attack is in play, destroy this to gain 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        chest: [predatoryPlating],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(brutalAssaultRed);
    game.advanceCombatTo("reaction");
    Rhinar.activate(predatoryPlating);
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, predatoryPlating).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveResourceCount(1);
  });

  it("boundary: cannot activate without controlling a 6{p} card", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, chest: [predatoryPlating], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.expectActivationRejected(predatoryPlating);
    expectFabCard(Rhinar, predatoryPlating).toBeIn("chest");
  });

  it("timing: Guardwell d2 stays seated after defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 40, chest: [predatoryPlating], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).attackWith(snatchRed);
    Rhinar.defendWith(predatoryPlating);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, predatoryPlating).toBeIn("chest");
    expectFabCard(Rhinar, predatoryPlating).toHaveDefenseCounters(-2);
    expectFabPlayer(Rhinar).toHaveLife(38);
  });
});
