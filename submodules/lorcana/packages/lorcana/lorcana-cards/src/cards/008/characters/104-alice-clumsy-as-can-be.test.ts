import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { aliceClumsyAsCanBe } from "./104-alice-clumsy-as-can-be";

const friendlyCharacter = createMockCharacter({
  id: "friendly-char",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const opponentCharacter1 = createMockCharacter({
  id: "opp-char-1",
  name: "Opponent Character 1",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const opponentCharacter2 = createMockCharacter({
  id: "opp-char-2",
  name: "Opponent Character 2",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Alice - Clumsy as Can Be", () => {
  it("should have Shift 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [aliceClumsyAsCanBe],
      deck: 1,
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: aliceClumsyAsCanBe,
      keyword: "Shift",
    });
  });

  describe("ACCIDENT PRONE — Whenever this character quests, put 1 damage counter on each other character.", () => {
    it("should put 1 damage on each other character (friendly and opposing) when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: aliceClumsyAsCanBe, isDrying: false }, friendlyCharacter],
          deck: 3,
        },
        {
          play: [opponentCharacter1, opponentCharacter2],
          deck: 3,
        },
      );

      const aliceId = testEngine.findCardInstanceId(aliceClumsyAsCanBe, "play");
      const friendlyId = testEngine.findCardInstanceId(friendlyCharacter, "play");
      const opp1Id = testEngine.findCardInstanceId(opponentCharacter1, "play", PLAYER_TWO);
      const opp2Id = testEngine.findCardInstanceId(opponentCharacter2, "play", PLAYER_TWO);

      // Quest with Alice
      expect(testEngine.asPlayerOne().quest(aliceClumsyAsCanBe)).toBeSuccessfulCommand();

      // The triggered ability should auto-resolve (selector: "all" targets don't need user input)
      // Resolve the bag if needed
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(aliceClumsyAsCanBe),
        ).toBeSuccessfulCommand();
      }

      // Each OTHER character should have 1 damage
      expect(testEngine.asServer().getCard(friendlyId).damage).toBe(1);
      expect(testEngine.asServer().getCard(opp1Id).damage).toBe(1);
      expect(testEngine.asServer().getCard(opp2Id).damage).toBe(1);

      // Alice herself should NOT have damage (the ability says "each other character")
      expect(testEngine.asServer().getCard(aliceId).damage).toBe(0);
    });

    it("should not damage Alice herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: aliceClumsyAsCanBe, isDrying: false }],
          deck: 3,
        },
        {
          play: [opponentCharacter1],
          deck: 3,
        },
      );

      const aliceId = testEngine.findCardInstanceId(aliceClumsyAsCanBe, "play");
      const opp1Id = testEngine.findCardInstanceId(opponentCharacter1, "play", PLAYER_TWO);

      // Quest with Alice
      expect(testEngine.asPlayerOne().quest(aliceClumsyAsCanBe)).toBeSuccessfulCommand();

      // Resolve the bag if needed
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(aliceClumsyAsCanBe),
        ).toBeSuccessfulCommand();
      }

      // Opponent character should have 1 damage
      expect(testEngine.asServer().getCard(opp1Id).damage).toBe(1);

      // Alice should have 0 damage
      expect(testEngine.asServer().getCard(aliceId).damage).toBe(0);
    });
  });
});
