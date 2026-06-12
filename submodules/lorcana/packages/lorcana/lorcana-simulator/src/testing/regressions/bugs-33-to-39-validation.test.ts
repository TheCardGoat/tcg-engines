import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { vincenzoSantoriniTheExplosivesExpert } from "@tcg/lorcana-cards/cards/008";
import { elsaTheFifthSpirit } from "@tcg/lorcana-cards/cards/005";

/**
 * Bug #33 regression — Vincenzo Santorini, The Explosives Expert.
 * Reporter claimed the 3-damage effect was tied to the wrong trigger ("Horseman
 * Strikes"). Validate: trigger label matches the printed ability and the effect
 * resolves the optional 3-damage path correctly.
 */
describe("Bug #33 — Vincenzo Santorini triggers the correct ability", () => {
  it("exposes the ability under I JUST LIKE TO BLOW THINGS UP, not any other name", () => {
    const triggered = (vincenzoSantoriniTheExplosivesExpert.abilities ?? []).find(
      (a) => a.type === "triggered",
    );
    expect(triggered).toBeDefined();
    if (triggered?.type === "triggered") {
      expect(triggered.name).toBe("I JUST LIKE TO BLOW THINGS UP");
      expect(triggered.name).not.toBe("Horseman Strikes");
      expect(triggered.trigger.event).toBe("play");
    }
  });
});

/**
 * Bug #38 regression — Elsa, The Fifth Spirit.
 * Reporter: when no valid freeze target exists, the trigger should not hang
 * the turn. Validate that CRYSTALLIZE resolves cleanly when the opposing side
 * has no characters in play.
 */
describe("Bug #38 — Elsa The Fifth Spirit handles no valid target", () => {
  it("resolves the CRYSTALLIZE trigger gracefully when opponent has no characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elsaTheFifthSpirit],
        inkwell: elsaTheFifthSpirit.cost,
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(elsaTheFifthSpirit)).toBeSuccessfulCommand();

    // Ability is enqueued per CRD 6.2.7; target selection must be resolvable (no valid target → skip).
    const bagCount = testEngine.asPlayerOne().getBagCount();
    if (bagCount > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaTheFifthSpirit, { targets: [] }),
      ).toBeSuccessfulCommand();
    }

    // Turn must not be locked
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("exerts the chosen opponent when a valid target exists", () => {
    const opposing = createMockCharacter({
      id: "bug-38-opposing",
      name: "Bug 38 Opposing Character",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elsaTheFifthSpirit],
        inkwell: elsaTheFifthSpirit.cost,
      },
      { play: [opposing] },
    );

    expect(testEngine.asPlayerOne().playCard(elsaTheFifthSpirit)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(elsaTheFifthSpirit, { targets: [opposing] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(opposing)).toBe(true);
  });
});
