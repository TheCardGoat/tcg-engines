import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { painfulPassageRed } from "../actions/painful-passage.ts";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { hoovesOfTheShadowbeast } from "./hooves-of-the-shadowbeast.ts";

/**
 * Hooves of the Shadowbeast — Shadow Brute Legs d1 Battleworn.
 *
 * Printed: Whenever a card with 6 or more {p} is put into your banished zone,
 * you may destroy this. If you do, gain 1 action point.
 */

describe("Hooves of the Shadowbeast AAA", () => {
  it("happy: banishing a 6+ {p} card may destroy this and grant an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        legs: [hoovesOfTheShadowbeast],
        hand: [painfulPassageRed, brutalAssaultRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(painfulPassageRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      effectResolution: "modify-numeric",
    });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Chane, brutalAssaultRed).toBeBanished();
    expectFabCard(Chane, hoovesOfTheShadowbeast).toBeIn("graveyard");
    expectFabPlayer(Chane).toHaveAP(2);
  });

  it("boundary: banishing a 4{p} card does not destroy the hooves", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        legs: [hoovesOfTheShadowbeast],
        hand: [painfulPassageRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(painfulPassageRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      effectResolution: "modify-numeric",
    });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Chane, brutalAssaultBlue).toBeBanished();
    expectFabCard(Chane, hoovesOfTheShadowbeast).toBeIn("legs");
    expectFabPlayer(Chane).toHaveAP(1);
  });
});
