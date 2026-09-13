import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayo } from "../heroes/kayo.ts";
import { highRollerBlue } from "./high-roller.ts";
import { readyToRollBlue } from "./ready-to-roll.ts";

describe("Ready to Roll (EVR003) AAA", () => {
  it("happy: a later roll this turn uses an extra die and keeps the highest", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [readyToRollBlue, highRollerBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(readyToRollBlue);
    game.untilIdle();
    Kayo.play(highRollerBlue);
    game.untilIdle({ entityTargets: "minimum" });

    const faces = game.lastDieFaces();
    expect(faces).toHaveLength(2);
    expect(game.lastDieFace()).toBe(Math.max(...faces));
    expectFabCard(Kayo, readyToRollBlue).toBeIn("graveyard");
  });

  it("boundary: without Ready to Roll a High Roller is a single die", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [highRollerBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(highRollerBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expect(game.lastDieFaces()).toHaveLength(1);
    expect(game.lastDieFace()).toBe(game.lastDieFaces()[0]);
  });

  it("timing: the extra die expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [readyToRollBlue, highRollerBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(readyToRollBlue);
    game.untilIdle();
    Kayo.endTurn();
    game.as(dash).endTurn();
    game.untilIdle();

    Kayo.play(highRollerBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expect(game.lastDieFaces()).toHaveLength(1);
  });
});
