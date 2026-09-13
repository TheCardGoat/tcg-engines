import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { engagedSwiftbladeRed } from "./engaged-swiftblade.ts";

/**
 * Engaged Swiftblade Red (HVY127) — Warrior Action, cost 1, 3{d}, go again.
 *
 * Printed: 'Your next Warrior attack this turn gets +3{p} and "If this is
 * defended by an attack action card, this gets Go again." Go again'
 */

describe("engaged-swiftblade family AAA", () => {
  it("happy: the next Warrior attack this turn gets +3{p} and go again when blocked by an attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [engagedSwiftbladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.play(engagedSwiftbladeRed);
    game.helpers.resolveUntilIdle();
    Kassai.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("defend");

    // Cintari Saber printed 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, engagedSwiftbladeRed).toBeIn("graveyard");

    Dash.defendWith(brutalAssaultBlue);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat();

    expectFabPlayer(Kassai).toHaveAP(1);
  });

  it("boundary: a Generic attack stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [engagedSwiftbladeRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(engagedSwiftbladeRed);
    game.helpers.resolveUntilIdle();
    Kassai.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: an action-card block that is not an attack action does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [engagedSwiftbladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.play(engagedSwiftbladeRed);
    game.helpers.resolveUntilIdle();
    Kassai.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat();

    expectFabPlayer(Kassai).toHaveAP(0);
  });
});
