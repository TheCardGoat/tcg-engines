import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chipRetrievalExpert } from "../characters/014-chip-retrieval-expert";
import { rangerTeamup } from "./028-ranger-team-up";

const sturdyTarget = createMockCharacter({
  id: "ranger-team-up-target",
  name: "Sturdy Target",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
});

describe("Ranger Team-Up", () => {
  it("gives chosen character +{S} equal to their {W} this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rangerTeamup],
      inkwell: rangerTeamup.cost,
      play: [{ card: sturdyTarget, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().playCard(rangerTeamup, { targets: [sturdyTarget] }),
    ).toBeSuccessfulCommand();

    // +{S} equal to their {W}: 1 (base) + 5 (willpower) = 6
    expect(testEngine.asPlayerOne().getCardStrength(sturdyTarget)).toBe(
      sturdyTarget.strength + sturdyTarget.willpower,
    );
  });

  it("strength bonus expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rangerTeamup],
      inkwell: rangerTeamup.cost,
      play: [{ card: sturdyTarget, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().playCard(rangerTeamup, { targets: [sturdyTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(sturdyTarget)).toBe(
      sturdyTarget.strength + sturdyTarget.willpower,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(sturdyTarget)).toBe(sturdyTarget.strength);
  });

  describe("release notes ruling", () => {
    it("uses MODIFIED willpower (not printed) for the +S amount — Chip's Friendly Assist (+1 W) adds to the bonus", () => {
      // Q&A: If an effect modifies the chosen character's {W}, Ranger Team-Up
      // uses the modified {W}. Chip Retrieval Expert grants +1 {W} to
      // characters named Dale in play. With a base 2 W Dale and Chip's buff,
      // the modified {W} = 3, so Ranger Team-Up should grant +3 {S}.
      const dale = createMockCharacter({
        id: "ranger-team-up-dale",
        name: "Dale",
        version: "Modifier Test",
        cost: 2,
        strength: 1,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rangerTeamup],
        inkwell: rangerTeamup.cost,
        play: [chipRetrievalExpert, { card: dale, isDrying: false }],
      });

      // Confirm modified {W} = 3.
      expect(testEngine.asPlayerOne().getCard(dale)?.willpower).toBe(dale.willpower + 1);

      expect(
        testEngine.asPlayerOne().playCard(rangerTeamup, { targets: [dale] }),
      ).toBeSuccessfulCommand();

      // +S equal to MODIFIED {W} = 3 → strength 1 + 3 = 4.
      expect(testEngine.asPlayerOne().getCardStrength(dale)).toBe(
        dale.strength + dale.willpower + 1,
      );
    });
  });
});
