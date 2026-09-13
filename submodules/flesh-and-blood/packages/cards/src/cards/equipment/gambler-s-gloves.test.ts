import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { highRollerBlue } from "../actions/high-roller.ts";
import { readyToRollBlue } from "../actions/ready-to-roll.ts";
import { kayo } from "../heroes/kayo.ts";
import { barkboneStrapping } from "./barkbone-strapping.ts";
import { gamblerSGloves } from "./gambler-s-gloves.ts";

describe("Gambler's Gloves (CRU179) AAA", () => {
  it("happy: after a d6 roll you may destroy this to reroll", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gamblerSGloves],
        chest: [barkboneStrapping],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(barkboneStrapping);
    game.helpers.resolveUntilIdle({ optionalOptions: "all" });

    expectFabCard(Bravo, barkboneStrapping).toBeIn("graveyard");
    expectFabCard(Bravo, gamblerSGloves).toBeIn("graveyard");
  });

  it("boundary: declining the optional keeps the gloves after the d6", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gamblerSGloves],
        chest: [barkboneStrapping],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(barkboneStrapping);
    game.helpers.resolveUntilIdle({ optionalOptions: "none" });

    expectFabCard(Bravo, barkboneStrapping).toBeIn("graveyard");
    expectFabCard(Bravo, gamblerSGloves).toBeIn("arms");
  });

  it("interaction: rerolls every die added by Ready to Roll", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        arms: [gamblerSGloves],
        hand: [readyToRollBlue, highRollerBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: "gamblers-ready-to-roll-2" },
    );
    const Kayo = game.as(kayo);

    Kayo.play(readyToRollBlue);
    game.untilIdle();
    Kayo.play(highRollerBlue);
    game.helpers.resolveUntilIdle({
      optionalOptions: "all",
      entityTargets: "minimum",
      ordering: "listed",
    });

    // The seeded first pool is discarded in full; these are the next two RNG
    // faces. Skipping only one original face yields a different result.
    expect(game.lastDieFaces()).toEqual([1, 4]);
    expectFabCard(Kayo, gamblerSGloves).toBeIn("graveyard");
  });

  it("timing: without a roll the gloves stay seated through end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [gamblerSGloves], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, gamblerSGloves).toBeIn("arms");
  });
});
