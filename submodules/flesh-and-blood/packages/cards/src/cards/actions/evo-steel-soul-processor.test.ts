import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { cogwerxBaseChest } from "../equipment/cogwerx-base-chest.ts";
import { evoBetaBaseChestBlue } from "./evo-beta-base-chest.ts";
import { evoSteelSoulProcessorBlue } from "./evo-steel-soul-processor.ts";

describe("Evo Steel Soul Processor (EVO027) AAA", () => {
  it("happy: Temper d3 — first defend contributes 3 and stays seated", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [evoSteelSoulProcessorBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(evoSteelSoulProcessorBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, evoSteelSoulProcessorBlue).toBeIn("chest");
    expectFabCard(Dash, evoSteelSoulProcessorBlue).toHaveDefenseCounters(-1);
    expectFabCard(Dash, evoSteelSoulProcessorBlue).toHaveKeyword("temper");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("happy: transforming an Evo base chest gains {r}{r}{r}", () => {
    // Evo Beta Base Chest also reduces Evo chest costs by {r}: pay 3 of 4,
    // then the a2 transform trigger adds {r}{r}{r} → 1 + 3 = 4.
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [evoBetaBaseChestBlue],
        hand: [evoSteelSoulProcessorBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoSteelSoulProcessorBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, evoSteelSoulProcessorBlue).toBeIn("chest");
    expectFabPlayer(Dash).toHaveResourceCount(4);
  });

  it("boundary: transforming a non-Evo base chest does not trigger", () => {
    // Release Notes — Bright Lights: the a2 trigger only fires from/into an
    // Evo partner; a Base-only chest (Cogwerx) transforms but grants nothing.
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [cogwerxBaseChest],
        hand: [evoSteelSoulProcessorBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoSteelSoulProcessorBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, evoSteelSoulProcessorBlue).toBeIn("chest");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });
});
