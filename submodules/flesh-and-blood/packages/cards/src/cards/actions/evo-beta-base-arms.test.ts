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
import { cogwerxBaseArms } from "../equipment/cogwerx-base-arms.ts";
import { evoSentryBaseArmsRed } from "./evo-sentry-base-arms.ts";
import { evoBetaBaseArmsBlue } from "./evo-beta-base-arms.ts";

describe("Evo Beta Base Arms (PEN070) AAA", () => {
  it("happy: Battleworn d1 — first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [evoBetaBaseArmsBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(evoBetaBaseArmsBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, evoBetaBaseArmsBlue).toBeIn("arms");
    expectFabCard(Dash, evoBetaBaseArmsBlue).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: without Beta Base Arms, Evo Sentry Arms (cost 2) cannot be paid with 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [cogwerxBaseArms],
        hand: [evoSentryBaseArmsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    expect(() => Dash.play(evoSentryBaseArmsRed)).toThrow();
    expectFabCard(Dash, evoSentryBaseArmsRed).toBeIn("hand");
  });

  it("happy: seated Beta Base Arms makes Evo arms cost {r} less (pay 1 of 2)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [evoBetaBaseArmsBlue],
        hand: [evoSentryBaseArmsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(evoSentryBaseArmsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Dash, evoSentryBaseArmsRed).toBeIn("arms");
    expect(Dash.resourcePoints()).toBe(0);
  });
});
