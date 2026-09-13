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
import { frontlinePlating } from "./frontline-plating.ts";

describe("Frontline Plating (DTD223) AAA", () => {
  it("happy: at the beginning of your end phase this gets a -1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [frontlinePlating], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, frontlinePlating).toBeIn("chest");
    expectFabCard(Bravo, frontlinePlating).toHaveDefenseCounters(-1);
    expectFabCard(Bravo, frontlinePlating).toHaveKeyword("blade-break");
  });

  it("boundary: the opponent's end phase does not put a -1{d} counter on this", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: bravo, chest: [frontlinePlating], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, frontlinePlating).toBeIn("chest");
    expectFabCard(Bravo, frontlinePlating).toHaveDefenseCounters(0);
  });

  it("timing: Blade Break destroys the plating after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, chest: [frontlinePlating], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(frontlinePlating);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, frontlinePlating).toBeIn("graveyard");
  });
});
