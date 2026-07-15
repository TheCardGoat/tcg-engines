import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "@tcg/lorcana-cards/cards/001";
import { royalGuardOctopusSoldier } from "@tcg/lorcana-cards/cards/008";

/**
 * THE-979: Simulator regression — duplicate "Whenever you draw" triggers on one card
 * must fully resolve (auto-drain) so Challenger +1 stacks per draw.
 */
describe("Royal Guard (Octopus Soldier) — HEAVILY ARMED (THE-979)", () => {
  const opposingCharacter = createMockCharacter({
    id: "the-979-opposing",
    name: "Opposing Character",
    cost: 2,
    strength: 2,
    willpower: 8,
  });

  it("stacks Challenger +1 when a single effect draws multiple cards (Friends on the Other Side)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: royalGuardOctopusSoldier, exerted: false, isDrying: false }],
        hand: [friendsOnTheOtherSide],
        inkwell: friendsOnTheOtherSide.cost,
        deck: 5,
      },
      {
        play: [{ card: opposingCharacter, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(royalGuardOctopusSoldier, "Challenger")).toBe(
      2,
    );

    expect(
      testEngine.asPlayerOne().challenge(royalGuardOctopusSoldier, opposingCharacter).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(
      royalGuardOctopusSoldier.strength + 2,
    );
  });
});
