/**
 * AAA test for condition: not.
 * Representative card: Enchanting Melody Red (ARC167) — Generic Action Aura.
 * End-phase trigger: "destroy Enchanting Melody unless you have played a
 * 'non-attack' action card this turn."
 * Tests the `not` condition combinator negating the
 * `played-non-attack-action-card-this-turn` status check.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, enchantingMelodyRed, tomeOfFyendalYellow } from "../../../fixtures.ts";

describe("condition: not", () => {
  it("Arrange/Act/Assert: Enchanting Melody is destroyed at end phase when no non-attack action was played (not-condition true)", () => {
    // Arrange — Place EM in the arena directly (not played, so no action-played status).
    const game = FabTestEngine.start(
      { hero: bravo, arena: [enchantingMelodyRed], deck: 4, intellect: 0 },
      { hero: dash, deck: 4, intellect: 0 },
    );
    const Bravo = game.as(bravo);

    // Precondition — EM is in the arena.
    expect(Bravo.zone("arena")).toContain(enchantingMelodyRed.canonicalId);

    // Act — End the turn (triggers end-phase → checks not(played-non-attack-action)).
    game.endTurn(Bravo.id);

    // Assert — No non-attack action was played, so not(condition) is true → destroy.
    expect(Bravo.zone("arena")).not.toContain(enchantingMelodyRed.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(enchantingMelodyRed.canonicalId);
  });

  it("AAA boundary: Enchanting Melody survives end phase when a non-attack action was played (not-condition false)", () => {
    // Arrange — Place EM in arena, then play a non-attack action (Tome of Fyendal).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tomeOfFyendalYellow],
        arena: [enchantingMelodyRed],
        deck: 4,
        intellect: 0,
        resourcePoints: 1,
      },
      { hero: dash, deck: 4, intellect: 0 },
    );
    const Bravo = game.as(bravo);

    // Act — Play Tome of Fyendal (a non-attack Action card), then end turn.
    Bravo.play(tomeOfFyendalYellow);
    game.passBoth();
    game.endTurn(Bravo.id);

    // Assert — A non-attack action was played, so not(condition) is false → NOT destroyed.
    expect(Bravo.zone("arena")).toContain(enchantingMelodyRed.canonicalId);
  });
});
