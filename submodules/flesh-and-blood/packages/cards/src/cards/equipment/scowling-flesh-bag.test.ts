import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { scowlingFleshBag } from "./scowling-flesh-bag.ts";

describe("Scowling Flesh Bag (DTD200) AAA", () => {
  it("happy: Blade Break destroys this after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 40, head: [scowlingFleshBag], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).attackWith(snatchRed);
    Rhinar.defendWith(scowlingFleshBag);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, scowlingFleshBag).toBeIn("graveyard");
    expectFabCard(Rhinar, scowlingFleshBag).toHaveKeyword("blade-break");
    expectFabPlayer(Rhinar).toHaveLife(38);
  });

  it("boundary: without defending, the bag stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 40, head: [scowlingFleshBag], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, scowlingFleshBag).toBeIn("head");
    expectFabPlayer(Rhinar).toHaveLife(36);
  });
});
