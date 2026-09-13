import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { spearsOfSurrealityBlue } from "../actions/spears-of-surreality.ts";
import { regurgitatingSlogRed } from "../actions/regurgitating-slog.ts";
import { dreamWeavers } from "./dream-weavers.ts";

/**
 * Dream Weavers (MON090) — Illusionist Arms.
 *
 * Printed:
 *   Action - Destroy Dream Weavers: The next Illusionist attack action card
 *   you play this turn loses and can't gain phantasm. Go again
 */

describe("Dream Weavers (MON090) AAA", () => {
  it("happy: next Illusionist attack loses phantasm so a p6 block does not pop it", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [dreamWeavers],
        hand: [spearsOfSurrealityBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.activate(dreamWeavers);
    game.helpers.resolveUntilIdle();
    expectFabCard(Prism, dreamWeavers).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveAP(1);

    Prism.attackWith(spearsOfSurrealityBlue);
    expectCombat(game).notToHaveKeyword("phantasm");
    Dash.defendWith(regurgitatingSlogRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: 0 action points cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [dreamWeavers],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(prism).activate(dreamWeavers)).toThrow();
    expectFabCard(game.as(prism), dreamWeavers).toBeIn("arms");
  });

  it("timing: without Dream Weavers a p6 block phantasm-destroys Spears", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spearsOfSurrealityBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.attackWith(spearsOfSurrealityBlue);
    expectCombat(game).toHaveKeyword("phantasm");
    game.as(dash).defendWith(regurgitatingSlogRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, spearsOfSurrealityBlue).toBeIn("graveyard");
    expectCombat(game).toBeClosed();
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
