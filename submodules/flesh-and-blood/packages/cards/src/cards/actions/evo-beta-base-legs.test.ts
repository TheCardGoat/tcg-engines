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
import { cogwerxBaseLegs } from "../equipment/cogwerx-base-legs.ts";
import { evoSentryBaseLegsRed } from "./evo-sentry-base-legs.ts";
import { evoBetaBaseLegsBlue } from "./evo-beta-base-legs.ts";

describe("Evo Beta Base Legs (PEN071) AAA", () => {
  it("happy: Battleworn d1 — first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, legs: [evoBetaBaseLegsBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(evoBetaBaseLegsBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, evoBetaBaseLegsBlue).toBeIn("legs");
    expectFabCard(Dash, evoBetaBaseLegsBlue).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: without Beta Base Legs, Evo Sentry Legs (cost 2) cannot be paid with 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [cogwerxBaseLegs],
        hand: [evoSentryBaseLegsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    expect(() => Dash.play(evoSentryBaseLegsRed)).toThrow();
    expectFabCard(Dash, evoSentryBaseLegsRed).toBeIn("hand");
  });

  it("happy: seated Beta Base Legs makes Evo legs cost {r} less (pay 1 of 2)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [evoBetaBaseLegsBlue],
        hand: [evoSentryBaseLegsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    // Prove the reduced gate: play is accepted with only 1{r} for a printed 2{r} Evo.
    expect(() => Dash.play(evoSentryBaseLegsRed)).not.toThrow();
    expect(Dash.resourcePoints()).toBe(0);
    // Transform/equip may leave the resolving Evo on stack/graveyard depending on
    // under-zone support; the cost-reduction clause is the proven surface here.
  });
});
