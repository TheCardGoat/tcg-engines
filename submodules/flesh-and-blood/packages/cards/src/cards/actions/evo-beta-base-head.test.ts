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
import { evoSentryBaseHeadRed } from "./evo-sentry-base-head.ts";
import { evoBetaBaseHeadBlue } from "./evo-beta-base-head.ts";

describe("Evo Beta Base Head (PEN068) AAA", () => {
  it("happy: Battleworn d1 — first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [evoBetaBaseHeadBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(evoBetaBaseHeadBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, evoBetaBaseHeadBlue).toBeIn("head");
    expectFabCard(Dash, evoBetaBaseHeadBlue).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: without Beta Base Head, Evo Sentry Head (cost 2) cannot be paid with 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [cogwerxBaseHead],
        hand: [evoSentryBaseHeadRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    expect(() => Dash.play(evoSentryBaseHeadRed)).toThrow();
    expectFabCard(Dash, evoSentryBaseHeadRed).toBeIn("hand");
  });

  it("happy: seated Beta Base Head makes Evo heads cost {r} less (pay 1 of 2)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoBetaBaseHeadBlue],
        hand: [evoSentryBaseHeadRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(evoSentryBaseHeadRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Dash, evoSentryBaseHeadRed).toBeIn("head");
    expect(Dash.resourcePoints()).toBe(0);
  });
});
