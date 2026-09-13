import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { cogwerxBaseHead } from "../equipment/cogwerx-base-head.ts";
import { evoBetaBaseHeadBlue } from "./evo-beta-base-head.ts";
import { evoSteelSoulMemoryBlue } from "./evo-steel-soul-memory.ts";

describe("Evo Steel Soul Memory (EVO026) AAA", () => {
  it("happy: Temper d3 — first defend contributes 3 and stays seated", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [evoSteelSoulMemoryBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(evoSteelSoulMemoryBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, evoSteelSoulMemoryBlue).toBeIn("head");
    expectFabCard(Dash, evoSteelSoulMemoryBlue).toHaveDefenseCounters(-1);
    expectFabCard(Dash, evoSteelSoulMemoryBlue).toHaveKeyword("temper");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("happy: transforming an Evo base head grants +1{i} until end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoBetaBaseHeadBlue],
        hand: [evoSteelSoulMemoryBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const intellectBefore = Dash.intellect();

    Dash.play(evoSteelSoulMemoryBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, evoSteelSoulMemoryBlue).toBeIn("head");
    expect(Dash.intellect()).toBe(intellectBefore + 1);
  });

  it("boundary: transforming a non-Evo base head does not trigger", () => {
    // Release Notes — Bright Lights: "This only triggers when it transforms
    // from/into an Evo. It does not trigger if it transforms from an equipment
    // with just the Base subtype and no Evo subtype." Cogwerx Base Head is
    // Base without Evo, so the transform still happens but a2 stays silent.
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [cogwerxBaseHead],
        hand: [evoSteelSoulMemoryBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const intellectBefore = Dash.intellect();

    Dash.play(evoSteelSoulMemoryBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, evoSteelSoulMemoryBlue).toBeIn("head");
    expect(Dash.intellect()).toBe(intellectBefore);
  });
});
