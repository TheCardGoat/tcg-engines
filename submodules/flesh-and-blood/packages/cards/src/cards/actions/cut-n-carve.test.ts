import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { nimblismBlue } from "./nimblism.ts";
import { cutNCarveBlue, cutNCarveRed, cutNCarveYellow } from "./cut-n-carve.ts";

/**
 * Cut n' Carve — Warrior Action, go again.
 *
 * Printed: Sharpen target sword you control. If it has the pitch-specific
 * number of +1{p} counters, its next attack this turn gets dominate.
 */

describe("cut-n-carve family AAA", () => {
  it("happy: red sharpens the sword and arms dominate for its next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(cutNCarveRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
    expectFabPlayer(Hala).toHaveAP(2);

    Hala.activate(zenithBlade);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: one yellow sharpen stays below its two-counter threshold", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(cutNCarveYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
    Hala.activate(zenithBlade);
    game.passBoth();
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("happy: two yellow sharpens reach the dominate threshold", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveYellow, cutNCarveYellow],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(cutNCarveYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.play(cutNCarveYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(2);
    Hala.activate(zenithBlade);
    game.passBoth();
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("happy: blue arms dominate exactly at three sharpen counters", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveBlue, cutNCarveBlue, cutNCarveBlue],
        resourcePoints: 4,
        actionPoints: 4,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    for (let i = 0; i < 3; i += 1) {
      Hala.play(cutNCarveBlue);
      game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    }
    expectFabCard(Hala, zenithBlade).toHaveCounters(3);
    Hala.activate(zenithBlade);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("timing: the armed dominate and sharpen counter expire at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(cutNCarveRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.activate(zenithBlade);
    game.passBoth();
    expectCombat(game).toHaveKeyword("dominate");
    game.helpers.resolveRestOfCombat();

    Hala.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Hala, zenithBlade).toHaveCounters(0);

    Hala.activate(zenithBlade);
    Hala.pitchFirst();
    game.passBoth();
    expectCombat(game).notToHaveKeyword("dominate");
    expectCombat(game).toHaveAttackPower(3);
  });
});
