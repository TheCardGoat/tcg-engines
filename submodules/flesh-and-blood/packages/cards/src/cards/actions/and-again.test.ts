import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabUnplayable,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { cutNCarveRed } from "./cut-n-carve.ts";
import { nimblismBlue } from "./nimblism.ts";
import { andAgainBlue } from "./and-again.ts";

/**
 * And Again... (MPW028) — Warrior Action, cost 1, 3{d}.
 *
 * Printed: Attack with target sword that has been sharpened and you've
 * attacked with this turn.
 */

describe("And Again... (MPW028) AAA", () => {
  it("happy: attack with the sword you sharpened and already attacked with this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed, andAgainBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(cutNCarveRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.activate(zenithBlade);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(16);

    Hala.play(andAgainBlue, { target: Hala.cardIn("weapon1", zenithBlade).instanceId });
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: a sharpened sword you have not attacked with is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed, andAgainBlue],
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

    expectFabUnplayable(
      () => Hala.play(andAgainBlue),
      /no legal target|cannot be played|couldn't be played/i,
    );
  });

  it("timing: last turn's sharpen and attack do not qualify this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [cutNCarveRed, andAgainBlue, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(cutNCarveRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.activate(zenithBlade);
    game.closeCombat({ optionals: "decline" });

    Hala.endTurn();
    game.untilIdle({ ordering: "listed" });
    Dash.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabUnplayable(
      () => Hala.play(andAgainBlue, { pitch: [nimblismBlue] }),
      /no legal target|cannot be played|couldn't be played/i,
    );
  });
});
