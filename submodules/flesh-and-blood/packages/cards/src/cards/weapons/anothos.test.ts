import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "../actions/disable.ts";
import { cartilageCrushRed } from "../actions/cartilage-crush.ts";
import { anothos } from "./anothos.ts";

describe("Anothos (BVO003) AAA", () => {
  it("happy: activate attacks for 4 power (base)", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, weapon1: [anothos], resourcePoints: 3, deck: 6 },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.activate(anothos);
    game.passBoth();
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: 2H occupies the sole weapon slot", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, weapon1: [anothos], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravoShowstopper);
    expect(Bravo.zone("weapon1")).toHaveLength(1);
    expect(Bravo.zone("weapon2")).toHaveLength(0);
  });

  it("timing: 2+ cards with cost ≥3 in the pitch zone give +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        weapon1: [anothos],
        pitch: [disableRed, cartilageCrushRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.activate(anothos);
    game.passBoth();
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });
});
