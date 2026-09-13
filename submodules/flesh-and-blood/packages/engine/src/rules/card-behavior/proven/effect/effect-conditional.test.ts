/**
 * AAA test for effect: conditional.
 * Representative card: Fyendal's Fighting Spirit (UPR194) — Generic Action Attack.
 * Triggered ability: "When this attacks or defends, if you have less {h} than an
 * opposing hero, gain 1{h}." The ability-level condition (life-comparison lt)
 * gates the gain-life effect.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, fyendalSFightingSpiritRed } from "../../../fixtures.ts";

describe("effect: conditional", () => {
  it("Arrange/Act/Assert: Fyendal's Fighting Spirit conditional grants 1 life when controller has less life than opponent", () => {
    // Arrange — Bravo at 15 life (below Dash's 20) so the life-comparison
    // condition (self < opponent) is satisfied.
    const game = FabTestEngine.start(
      { hero: bravo, life: 15, hand: [fyendalSFightingSpiritRed], deck: 4, resourcePoints: 3 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Act — Declare the attack. The "when this attacks" trigger fires and
    // the conditional life-comparison is evaluated.
    Bravo.attackWith(fyendalSFightingSpiritRed);
    game.helpers.resolveRestOfCombat();

    // Assert — Condition met: gained 1 life (15 → 16).
    expect(Bravo.life()).toBe(16);
  });

  it("AAA boundary: at equal life the conditional does not grant life", () => {
    // Arrange — Both heroes at 20 life; life-comparison lt is false.
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [fyendalSFightingSpiritRed], deck: 4, resourcePoints: 3 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Act
    Bravo.attackWith(fyendalSFightingSpiritRed);
    game.helpers.resolveRestOfCombat();

    // Assert — Condition not met: life unchanged.
    expect(Bravo.life()).toBe(20);
  });
});
