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
import { ironrotLegs } from "./ironrot-legs.ts";

describe("Ironrot Legs (BVO007) AAA", () => {
  it("happy: Blade Break destroys the leg guards after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, legs: [ironrotLegs], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ironrotLegs);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, ironrotLegs).toBeIn("graveyard");
  });

  it("boundary: Blade Break does not trigger when the leg guards does not defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, legs: [ironrotLegs], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, ironrotLegs).toBeIn("legs");
  });
});
