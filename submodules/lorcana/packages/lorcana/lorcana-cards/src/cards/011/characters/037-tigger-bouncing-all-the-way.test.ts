import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { tiggerBouncingAllTheWay } from "./037-tigger-bouncing-all-the-way";

const cheapCharacter = createMockCharacter({
  id: "tigger-bat-cheap-char",
  name: "Cheap Character",
  cost: 2,
});

const cheapItem = createMockItem({
  id: "tigger-bat-cheap-item",
  name: "Cheap Item",
  cost: 2,
});

const cheapLocation = createMockLocation({
  id: "tigger-bat-cheap-location",
  name: "Cheap Location",
  cost: 2,
});

describe("Tigger - Bouncing All the Way", () => {
  describe("SPLENDERIFFIC BOUNCE - When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.", () => {
    it("returns a chosen character with cost 2 or less to their player's hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: tiggerBouncingAllTheWay.cost,
        hand: [tiggerBouncingAllTheWay],
        play: [cheapCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
      expect(testEngine.asPlayerOne().playCard(tiggerBouncingAllTheWay)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tiggerBouncingAllTheWay, {
          resolveOptional: true,
          targets: [cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
    });
    it("returns a chosen item with cost 2 or less to their player's hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: tiggerBouncingAllTheWay.cost,
        hand: [tiggerBouncingAllTheWay],
        play: [cheapItem],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("play");
      expect(testEngine.asPlayerOne().playCard(tiggerBouncingAllTheWay)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tiggerBouncingAllTheWay, {
          resolveOptional: true,
          targets: [cheapItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("hand");
    });

    it("returns a chosen location with cost 2 or less to their player's hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: tiggerBouncingAllTheWay.cost,
        hand: [tiggerBouncingAllTheWay],
        play: [cheapLocation],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardZone(cheapLocation)).toBe("play");
      expect(testEngine.asPlayerOne().playCard(tiggerBouncingAllTheWay)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tiggerBouncingAllTheWay, {
          resolveOptional: true,
          targets: [cheapLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapLocation)).toBe("hand");
    });

    it("returns an opponent's character with cost 2 or less to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: tiggerBouncingAllTheWay.cost,
          hand: [tiggerBouncingAllTheWay],
          deck: 3,
        },
        {
          play: [cheapCharacter],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerTwo().getCardZone(cheapCharacter)).toBe("play");
      expect(testEngine.asPlayerOne().playCard(tiggerBouncingAllTheWay)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      const opponentCharId = testEngine.findCardInstanceId(cheapCharacter, "play", PLAYER_TWO);
      expect(opponentCharId).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tiggerBouncingAllTheWay, {
          resolveOptional: true,
          targets: [opponentCharId!],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(cheapCharacter)).toBe("hand");
    });

    it("is optional — can be declined without returning any card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: tiggerBouncingAllTheWay.cost,
        hand: [tiggerBouncingAllTheWay],
        play: [cheapCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(tiggerBouncingAllTheWay)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tiggerBouncingAllTheWay, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
    });
  });
});
