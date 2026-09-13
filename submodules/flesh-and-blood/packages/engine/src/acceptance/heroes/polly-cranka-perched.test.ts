/**
 * SEA003 Polly Cranka — Perched attack-target acceptance.
 *
 * CR 8.3.39c: an equipped card with Perched cannot be an attack target.
 * This exercise deliberately covers only that target-prohibition subclause;
 * Perched's 2H weapon-zone occupancy exception is a separate engine cluster.
 */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, cintariSellsword, dash, snatchRed } from "../../rules/fixtures.ts";

import { pollyCranka } from "../../../../cards/src/cards/companions/polly-cranka.ts";

describe("Polly Cranka Perched (SEA003)", () => {
  it("rejects an attack targeting equipped Polly, then still permits an attack at the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, weapon1: [pollyCranka], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Polly = game.as(dash).findCardInZone("weapon1", pollyCranka);
    const Snatch = game.as(bravo).findCardInZone("hand", snatchRed);

    const rejected = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: { instanceId: Snatch, target: Polly },
    });

    expect(rejected.accepted).toBe(false);
    if (!rejected.accepted) {
      expect(["illegal_target", "illegal_attack_target"]).toContain(rejected.errorCode);
    }

    // The failed target declaration has no lingering combat state: the same
    // card can still legally attack the only opposing hero in this 1v1 match.
    const heroAttack = game.as(bravo).exec({
      move: "begin-play",
      payload: { instanceId: Snatch, target: game.as(dash).id },
    });
    expect(heroAttack.accepted).toBe(true);
  });

  it("does not prohibit attacking an otherwise identical non-Perched ally", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, arena: [cintariSellsword], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const ally = game.as(dash).findCardInZone("arena", cintariSellsword);
    const Snatch = game.as(bravo).findCardInZone("hand", snatchRed);

    const accepted = game.as(bravo).exec({
      move: "begin-play",
      payload: { instanceId: Snatch, target: ally },
    });

    expect(accepted.accepted).toBe(true);
  });
});
