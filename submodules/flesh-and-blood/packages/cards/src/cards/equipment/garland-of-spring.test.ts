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
import { garlandOfSpring } from "./garland-of-spring.ts";

describe("Garland of Spring (SUP212) AAA", () => {
  it("happy: destroy this to gain 1 resource and go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [garlandOfSpring], actionPoints: 1, resourcePoints: 0, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(garlandOfSpring);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, garlandOfSpring).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: defending with d0 still takes the full 4 from Snatch", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [garlandOfSpring], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(garlandOfSpring);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, garlandOfSpring).toBeIn("chest");
  });
});
