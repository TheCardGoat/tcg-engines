import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { frostSpikeBlue } from "./frost-spike.ts";

/**
 * Frost Spike (PEN226) — Ice Wizard Instant, cost 0.
 * Printed: "Create a Frostbite token in an exposed head, chest, arms, or legs zone."
 */

describe("Frost Spike (PEN226) AAA", () => {
  it("happy: creates a Frostbite in the opponent's first exposed equipment zone", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [frostSpikeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(frostSpikeBlue);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("head")).toContain("token:frostbite");
    expectFabPlayer(Iyslander).toHaveTokenCount("frostbite", 0);
    expectFabCard(Iyslander, frostSpikeBlue).toBeIn("graveyard");
  });

  it("boundary: the caster does not receive the Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [frostSpikeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(frostSpikeBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Iyslander).toHaveTokenCount("frostbite", 0);
    expect(Iyslander.zone("head")).not.toContain("token:frostbite");
  });

  it("timing: may be cast in the attacker's reaction window on the caster's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [brutalAssaultBlue, frostSpikeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Iyslander.play(frostSpikeBlue);
    game.helpers.resolveUntilIdle();

    expect(game.as(dash).zone("head")).toContain("token:frostbite");
    expectFabCard(Iyslander, frostSpikeBlue).toBeIn("graveyard");
  });
});
