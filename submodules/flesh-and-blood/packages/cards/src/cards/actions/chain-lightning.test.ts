import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { chainLightningYellow } from "./chain-lightning.ts";
import { zapBlue } from "./zap.ts";
import { zapRed } from "./zap.ts";

/**
 * Chain Lightning Yellow (CRU162) — Wizard Action.
 *
 * Printed: You may play your next Wizard 'non-attack' action card this turn
 * as though it were an instant.
 * If you have played another Wizard 'non-attack' action card this turn, deal
 * 3 arcane damage to each opposing hero.
 */

describe("Chain Lightning (CRU162) AAA", () => {
  it("happy: after another Wizard non-attack action, deals 3 arcane and grants the instant permission", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [zapRed, chainLightningYellow, zapBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(17); // 20 - 3

    Kano.play(chainLightningYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Condition leg: another Wizard non-attack action was played this turn.
    expectFabPlayer(Dash).toHaveLife(14); // 17 - 3
    expectFabCard(Kano, chainLightningYellow).toBeIn("graveyard");

    // Permission leg: Zap blue follows through Chain Lightning as an instant.
    Kano.must.playInstant(zapBlue, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(13); // 14 - 1
    expectFabCard(Kano, zapBlue).toBeIn("graveyard");
  });

  it("boundary: played as the first Wizard non-attack action, no arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [chainLightningYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(chainLightningYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Kano, chainLightningYellow).toBeIn("graveyard");
  });
});
