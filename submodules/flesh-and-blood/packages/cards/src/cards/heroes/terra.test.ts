import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  expectFabToken,
  expectWait,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { terra } from "./terra.ts";
import { redwoodHammer } from "../weapons/redwood-hammer.ts";
import { weaveEarthRed } from "../actions/weave-earth.ts";

/**
 * Terra (TER001) — Elemental Guardian Hero — Young — 20hp.
 *
 * Printed: "At the beginning of each end phase, if there is an Earth card in
 * your pitch zone, you may pay {r}. If you do, create a Might token."
 *
 * Signature weapon: Redwood Hammer (TER002).
 */

const opponentHero = dash;

describe("terra (TER001) AAA", () => {
  it("core mechanic: end phase with Earth in pitch — pay {r} to create a Might token", () => {
    const game = FabTestEngine.start(
      { hero: terra, pitch: [weaveEarthRed], resourcePoints: 1, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Terra = game.as(terra);

    // End the turn to enter the end phase; the trigger offers the pay.
    Terra.endTurn();
    Terra.accept();

    expectFabPlayer(Terra).toHaveResourceCount(0);
    expectFabToken(game, "might").toHaveCount(1);
  });

  it("boundary: declining the pay creates no Might token", () => {
    const game = FabTestEngine.start(
      { hero: terra, pitch: [weaveEarthRed], resourcePoints: 1, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Terra = game.as(terra);

    Terra.endTurn();
    Terra.decline();

    expectFabToken(game, "might").toHaveCount(0);
  });

  it("boundary: no Earth in pitch → no offer, no Might", () => {
    const game = FabTestEngine.start(
      { hero: terra, resourcePoints: 1, deck: 6, hand: [] },
      { hero: opponentHero, deck: 6 },
    );
    const Terra = game.as(terra);

    Terra.endTurn();

    expectWait(game).notToHaveDecision();
    expectFabToken(game, "might").toHaveCount(0);
  });

  it("signature weapon: Redwood Hammer attacks for {r}{r}{r} at power 3", () => {
    const game = FabTestEngine.start(
      {
        hero: terra,
        weapon1: [redwoodHammer],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Terra = game.as(terra);

    Terra.activate(redwoodHammer);
    game.passBoth();

    expectFabPlayer(Terra).toHaveResourceCount(0);
    expectCombat(game).toBeOpen().toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline" });
  });

  it("boundary: Redwood Hammer is once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: terra,
        weapon1: [redwoodHammer],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Terra = game.as(terra);

    Terra.activate(redwoodHammer);
    game.passBoth();
    expectCombat(game).toBeOpen();
    game.closeCombat({ optionals: "decline" });

    Terra.expectActivationRejected(redwoodHammer);
  });
});
