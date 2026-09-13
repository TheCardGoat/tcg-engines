import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { boundingDemigonBlue } from "./bounding-demigon.ts";
import { otherworldlySinsYellow } from "./otherworldly-sins.ts";
import { peacefulSanctuaryRed } from "./peaceful-sanctuary.ts";

/**
 * Peaceful Sanctuary (red) — Generic Action - Aura, cost 0.
 *
 * Printed: "Heroes can't create aura tokens.\nAt the start of your action
 * phase, destroy this."
 */

describe("Peaceful Sanctuary (MPW144) AAA", () => {
  it("happy: while the aura is in the arena, Otherworldly Sins' Runechant creation is suppressed", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [peacefulSanctuaryRed, otherworldlySinsYellow, boundingDemigonBlue],
        resourcePoints: 1,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(peacefulSanctuaryRed);
    game.untilIdle();

    Chane.play(otherworldlySinsYellow);
    game.untilIdle();

    // The restricted create is skipped; the rest of the card still resolves.
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 0);

    Chane.playAttack(boundingDemigonBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3); // the +2{p} leg is unaffected (1 base + 2)
    game.closeCombat();
    // No live Runechant, so no arcane ping on top of the 3 combat damage.
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: the aura persists through the opponent's turn and self-destructs at your action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [peacefulSanctuaryRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(peacefulSanctuaryRed);
    game.untilIdle();
    expectFabCard(Chane, peacefulSanctuaryRed).toBeIn("arena");

    Chane.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Chane, peacefulSanctuaryRed).toBeIn("graveyard");
  });

  it("boundary: without the aura, the same play creates its Runechant token", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [otherworldlySinsYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(otherworldlySinsYellow);
    game.untilIdle();

    expectFabPlayer(Chane).toHaveTokenCount("runechant", 1);
  });
});
