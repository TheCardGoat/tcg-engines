import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { sharpInclineRed } from "../actions/sharp-incline.ts";
import { paragonPlate } from "./paragon-plate.ts";

/**
 * Paragon Plate (AHA004) — Warrior Chest d2, Temper.
 * Printed: "Attack Reaction - {t}, remove a +1{p} counter from an attacking
 * sword you control: Gain {r}"
 */

describe("Paragon Plate (AHA004) AAA", () => {
  it("happy: taps to strip the attacking sword's +1{p} counter and gain 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        chest: [paragonPlate],
        weapon1: [dawnblade],
        hand: [sharpInclineRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dorinthea = game.as(dorinthea);
    const Dash = game.as(dash);

    // Sharpen Dawnblade so the attacking sword carries a +1{p} counter.
    Dorinthea.play(sharpInclineRed, { targetCard: dawnblade });
    game.untilIdle();
    expectFabCard(Dorinthea, dawnblade).toHaveCounters(1);

    Dorinthea.activateAttack(dawnblade);
    Dash.defendWith();
    game.toReaction("attacker");
    Dorinthea.activate(paragonPlate);

    // The printed payoff: the attacking sword's +1{p} counter is gone, the
    // plate tapped, and the resource gained.
    expectFabCard(Dorinthea, dawnblade).toHaveCounters(0);
    expectFabCard(Dorinthea, paragonPlate).toBeTapped();
    expectFabPlayer(Dorinthea).toHaveResourceCount(1); // 1 - 1 attack + 1 gain

    game.closeCombat({ optionals: "decline" });
    // The chain link keeps its declaration-time power (3), so Dash still takes 3.
    expectFabPlayer(Dash).toHaveLife(17); // 20 - 3
  });

  it("boundary: with no +1{p} counter in play the reaction has nothing to pay with", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        chest: [paragonPlate],
        weapon1: [dawnblade],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dorinthea = game.as(dorinthea);
    const Dash = game.as(dash);

    Dorinthea.activateAttack(dawnblade);
    Dash.defendWith();
    game.toReaction("attacker");

    Dorinthea.expectActivationRejected(paragonPlate);
    expectFabCard(Dorinthea, paragonPlate).toBeIn("chest");
    expectFabCard(Dorinthea, paragonPlate).toBeReady();
  });
});
