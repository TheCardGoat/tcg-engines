import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { arthurKingVictoriousEnchanted } from "./221-arthur-king-victorious-enchanted";

const targetCharacter = createMockCharacter({
  id: "knight-target",
  name: "Knight Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Arthur - King Victorious (Enchanted)", () => {
  it("KNIGHTED BY THE KING - grants Challenger +2, Resist +2, and can challenge ready characters this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurKingVictoriousEnchanted],
      inkwell: arthurKingVictoriousEnchanted.cost,
      play: [targetCharacter],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(arthurKingVictoriousEnchanted),
    ).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(arthurKingVictoriousEnchanted, { targets: [targetCharacter] }),
    ).toBeSuccessfulCommand();

    // Should gain Challenger +2
    expect(testEngine.getKeywordValue(targetCharacter, "Challenger")).toBe(2);
    // Should gain Resist +2
    expect(testEngine.getKeywordValue(targetCharacter, "Resist")).toBe(2);
    // Should be able to challenge ready characters
    expect(testEngine.hasGrantedAbility(targetCharacter, "can-challenge-ready")).toBe(true);
  });

  it("KNIGHTED BY THE KING - effects expire at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [arthurKingVictoriousEnchanted],
        inkwell: arthurKingVictoriousEnchanted.cost,
        play: [targetCharacter],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(arthurKingVictoriousEnchanted),
    ).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(arthurKingVictoriousEnchanted, { targets: [targetCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // All effects should have expired
    expect(testEngine.getKeywordValue(targetCharacter, "Challenger")).toBeNull();
    expect(testEngine.getKeywordValue(targetCharacter, "Resist")).toBeNull();
    expect(testEngine.hasGrantedAbility(targetCharacter, "can-challenge-ready")).toBe(false);
  });
});
