import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { razorReflexRed } from "../attack-reactions/razor-reflex.ts";
import { honedForHonorBlue } from "./honed-for-honor.ts";

/**
 * Honed for Honor (MPW031) — Warrior Action, cost 0, Sharpen, go again.
 *
 * Printed: "Sharpen target sword you control.\nIf it has 3 or more +1{p}
 * counters, you may put an attack reaction card from your graveyard on top of
 * your deck.\nGo again"
 */

describe("Honed for Honor (MPW031) AAA", () => {
  it("happy: at 3 +1{p}, you may put an attack reaction from GY on top", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 2 } }],
        hand: [honedForHonorBlue],
        graveyard: [razorReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(honedForHonorBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Hala, zenithBlade).toHaveCounters(3);
    expect(Hala.zone("deck").at(-1)).toBe(razorReflexRed.canonicalId);
    expectFabPlayer(Hala).toHaveAP(1);
  });

  it("boundary: below three counters the attack reaction stays in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 1 } }],
        hand: [honedForHonorBlue],
        graveyard: [razorReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(honedForHonorBlue);
    game.untilIdle();

    expectFabCard(Hala, zenithBlade).toHaveCounters(2);
    expectFabCard(Hala, razorReflexRed).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveAP(1);
  });

  it("timing: at three counters, declining the optional leaves the reaction in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 2 } }],
        hand: [honedForHonorBlue],
        graveyard: [razorReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(honedForHonorBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Hala, zenithBlade).toHaveCounters(3);
    expectFabCard(Hala, razorReflexRed).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveAP(1);
  });
});
