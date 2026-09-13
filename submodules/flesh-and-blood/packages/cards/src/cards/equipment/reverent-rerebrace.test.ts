import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { sharpInclineRed } from "../actions/sharp-incline.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { reverentRerebrace } from "./reverent-rerebrace.ts";

/**
 * Reverent Rerebrace (AHA005) — Warrior Arms d2 Temper.
 *
 * Printed: "If you would sharpen a Zenith Blade, instead you may pay {r} and
 * destroy this. If you do, sharpen it an additional time. Temper"
 */

describe("Reverent Rerebrace (AHA005) AAA", () => {
  it("happy: paying {r} destroys the arms and sharpens the Zenith Blade an additional time", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [zenithBlade],
        arms: [reverentRerebrace],
        hand: [sharpInclineRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(sharpInclineRed);
    Bravo.target(zenithBlade);
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Bravo, reverentRerebrace).toBeIn("graveyard");
    // Base sharpen + the paid additional sharpen.
    expectFabCard(Bravo, zenithBlade).toHaveCounters(2);
    expectFabPlayer(Bravo).toHaveResourceCount(1); // 2 - 1 paid
  });

  it("boundary: with no {r} to pay the replacement does not apply — base sharpen only, arms stay", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [zenithBlade],
        arms: [reverentRerebrace],
        hand: [sharpInclineRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(sharpInclineRed);
    Bravo.target(zenithBlade);
    game.untilIdle();

    expectFabCard(Bravo, reverentRerebrace).toBeIn("arms");
    expectFabCard(Bravo, zenithBlade).toHaveCounters(1);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("timing: sharpening a non-Zenith sword never offers the replacement", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        arms: [reverentRerebrace],
        hand: [sharpInclineRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(sharpInclineRed);
    Bravo.target(dawnblade);
    game.untilIdle();

    expectFabCard(Bravo, reverentRerebrace).toBeIn("arms");
    expectFabCard(Bravo, dawnblade).toHaveCounters(1);
    expectFabPlayer(Bravo).toHaveResourceCount(3);
  });
});
