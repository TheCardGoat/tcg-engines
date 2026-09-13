import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gravenWalkers } from "./graven-walkers.ts";

describe("Graven Walkers (PEN140) AAA", () => {
  it("happy: seating from anywhere but the GY puts a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: arakni, legs: [gravenWalkers], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.helpers.resolveUntilIdle();
    expectFabCard(game.as(arakni), gravenWalkers).toBeIn("legs");
    expectFabCard(game.as(arakni), gravenWalkers).toHaveDefenseCounters(-1);
  });

  it("boundary: fewer than two Silver cannot equip this from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: arakni,
        graveyard: [gravenWalkers],
        arena: [fabToken("silver")],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(game.as(arakni), gravenWalkers).toBeIn("graveyard");
  });

  it("timing: the seating −1{d} counter persists through a turn change", () => {
    const game = FabTestEngine.start(
      { hero: arakni, legs: [gravenWalkers], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.helpers.resolveUntilIdle();
    Arakni.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Arakni, gravenWalkers).toBeIn("legs");
    expectFabCard(Arakni, gravenWalkers).toHaveDefenseCounters(-1);
  });

  it("timing: Blade Break destroys this after it defends at 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: arakni, life: 20, legs: [gravenWalkers], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.helpers.resolveUntilIdle();
    game.as(dash).attackWith(snatchRed);
    Arakni.defendWith(gravenWalkers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Arakni, gravenWalkers).toBeIn("graveyard");
  });
});
