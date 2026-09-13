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
import { cogwerxBaseChest } from "../equipment/cogwerx-base-chest.ts";
import { evoSentryBaseChestRed } from "./evo-sentry-base-chest.ts";
import { evoBetaBaseChestBlue } from "./evo-beta-base-chest.ts";

describe("Evo Beta Base Chest (PEN069) AAA", () => {
  it("happy: Battleworn d1 — first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [evoBetaBaseChestBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(evoBetaBaseChestBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, evoBetaBaseChestBlue).toBeIn("chest");
    expectFabCard(Dash, evoBetaBaseChestBlue).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: without Beta Base Chest, Evo Sentry Chest (cost 2) cannot be paid with 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [cogwerxBaseChest],
        hand: [evoSentryBaseChestRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    expect(() => Dash.play(evoSentryBaseChestRed)).toThrow();
    expectFabCard(Dash, evoSentryBaseChestRed).toBeIn("hand");
  });

  it("happy: seated Beta Base Chest makes Evo chests cost {r} less (pay 1 of 2)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [evoBetaBaseChestBlue],
        hand: [evoSentryBaseChestRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(evoSentryBaseChestRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Dash, evoSentryBaseChestRed).toBeIn("chest");
    expect(Dash.resourcePoints()).toBe(0);
  });
});
