import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { goldHunterLongboatYellow } from "./gold-hunter-longboat.ts";

/**
 * Gold Hunter Longboat (SEA163) — Pirate Action-Attack.
 *
 * Printed:
 *   If you control less Gold than an opponent, this gets +2{p}.
 */

describe("Gold Hunter Longboat (SEA163) AAA", () => {
  it("happy: controlling less Gold than the opponent grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [goldHunterLongboatYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [fabToken("gold")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(goldHunterLongboatYellow);
    // Base 3 + 2 = 5.
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: equal Gold (none each) keeps the printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [goldHunterLongboatYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(goldHunterLongboatYellow);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: controlling more Gold than the opponent does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [goldHunterLongboatYellow],
        arena: [fabToken("gold")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(goldHunterLongboatYellow);
    expectCombat(game).toHaveAttackPower(3);
  });
});
