import { tempestAuroraBlue } from "./tempest-aurora.ts";

import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { tempestAuroraRed } from "./tempest-aurora.ts";
import { zapRed } from "./zap.ts";

/**
 * Tempest Aurora Red (DYN209) — Wizard Action. Go again.
 *
 * Printed: The next card you play this turn with cost 2 or less and an
 * arcane damage effect, instead deals that much arcane damage plus 1.
 */

describe("Tempest Aurora (DYN209) AAA", () => {
  it("happy: the next cheap arcane card this turn deals plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [tempestAuroraRed, zapRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(tempestAuroraRed);
    game.helpers.resolveUntilIdle(); // go again refunds the action point
    Kano.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - (3 + 1)
    expectFabCard(Kano, zapRed).toBeIn("graveyard");
  });

  it("boundary: a card with no arcane damage effect is not amped", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [tempestAuroraRed, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(tempestAuroraRed);
    game.helpers.resolveUntilIdle();
    Kano.playAttack(brutalAssaultBlue);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4, printed power only
  });

  it("happy: the next cheap arcane card this turn deals plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [tempestAuroraBlue, zapRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(tempestAuroraBlue);
    game.helpers.resolveUntilIdle(); // go again refunds the action point
    Kano.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - (3 + 1)
    expectFabCard(Kano, zapRed).toBeIn("graveyard");
  });
});
