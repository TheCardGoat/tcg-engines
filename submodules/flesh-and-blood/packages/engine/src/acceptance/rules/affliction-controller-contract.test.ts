import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, hypothermiaBlue } from "../../rules/fixtures.ts";

/**
 * CR 8.2.11c: as an Affliction enters the arena as a permanent, its controller
 * declares an opponent and it enters under that opponent's control. This is the
 * 1v1 fast-path: the affliction always enters under the other player.
 */
describe("CR 8.2.11c Affliction controller", () => {
  it("an Affliction resolves into the opponent's arena (1v1 fast-path)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [hypothermiaBlue], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(hypothermiaBlue);
    game.helpers.resolveUntilIdle();

    // The affliction was put under the opponent's control, not the caster's.
    expect(game.as(bravo).zone("arena")).not.toContain(hypothermiaBlue.canonicalId);
    expect(game.as(dash).zone("arena")).toContain(hypothermiaBlue.canonicalId);
  });
});
