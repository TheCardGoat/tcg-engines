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
import { oldKnocker } from "./old-knocker.ts";

describe("Old Knocker (SEA182) AAA", () => {
  it("happy: Instant tap-hero + destroy this gains 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [oldKnocker],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, oldKnocker).toHaveKeyword("blade-break");

    Bravo.must.activate(oldKnocker);

    expectFabCard(Bravo, oldKnocker).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
    expectFabCard(Bravo, bravo).toBeTapped();
  });

  it("boundary: cannot activate while the hero is already tapped", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        heroState: { tapped: true },
        chest: [oldKnocker],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );

    game.as(bravo).expectActivationRejected(oldKnocker);
    expectFabCard(game.as(bravo), oldKnocker).toBeIn("chest");
  });

  it("keyword: Blade Break destroys Old Knocker after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, chest: [oldKnocker], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(oldKnocker);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, oldKnocker).toBeIn("graveyard");
  });
});
