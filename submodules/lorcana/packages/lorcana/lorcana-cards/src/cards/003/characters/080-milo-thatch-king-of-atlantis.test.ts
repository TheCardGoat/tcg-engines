import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { miloThatchKingOfAtlantis } from "./080-milo-thatch-king-of-atlantis";

const challenger = createMockCharacter({
  id: "milo-test-challenger",
  name: "Test Challenger",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const opponentCharA = createMockCharacter({
  id: "milo-opponent-a",
  name: "Opponent Character A",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opponentCharB = createMockCharacter({
  id: "milo-opponent-b",
  name: "Opponent Character B",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const allyCharacter = createMockCharacter({
  id: "milo-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

function resolveMiloBag(
  testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
) {
  const bagCount = testEngine.asPlayerTwo().getBagCount();
  if (bagCount > 0) {
    const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
    testEngine.asPlayerTwo().resolvePendingByCard(miloThatchKingOfAtlantis, {});
  }
}

describe("Milo Thatch - King of Atlantis", () => {
  describe("Shift 4", () => {
    it("has the Shift keyword with value 4", () => {
      const shiftAbility = miloThatchKingOfAtlantis.abilities?.find(
        (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Shift",
      );
      expect(shiftAbility).toBeDefined();
      expect((shiftAbility as { cost: { ink: number } }).cost?.ink).toBe(4);
    });
  });

  describe("TAKE THEM BY SURPRISE: When this character is banished, return all opposing characters to their players' hands.", () => {
    it("returns all opposing characters to hand when Milo is banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [challenger],
          deck: 1,
        },
        {
          play: [{ card: miloThatchKingOfAtlantis, exerted: true }, opponentCharA, opponentCharB],
          deck: 1,
        },
      );

      // Player one challenges Milo, who gets banished (strength 5 vs willpower 4)
      expect(
        testEngine.asPlayerOne().challenge(challenger, miloThatchKingOfAtlantis),
      ).toBeSuccessfulCommand();

      resolveMiloBag(testEngine);

      // All opposing characters (from Milo's controller's perspective = player one's characters)
      // should be returned to hand
      expect(testEngine.asPlayerOne().getCardZone(challenger)).toBe("hand");
      // Milo's controller's other characters should stay in play
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharA)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharB)).toBe("play");
      // Milo should be in discard (he was banished)
      expect(testEngine.asPlayerTwo().getCardZone(miloThatchKingOfAtlantis)).toBe("discard");
    });

    it("does not affect the controller's own characters when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [challenger],
          deck: 1,
        },
        {
          play: [{ card: miloThatchKingOfAtlantis, exerted: true }, allyCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(challenger, miloThatchKingOfAtlantis),
      ).toBeSuccessfulCommand();

      resolveMiloBag(testEngine);

      // Ally character stays in play (same controller as Milo)
      expect(testEngine.asPlayerTwo().getCardZone(allyCharacter)).toBe("play");
      // Opponent's challenger is returned to hand
      expect(testEngine.asPlayerOne().getCardZone(challenger)).toBe("hand");
    });

    it("returns multiple opposing characters to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [challenger, opponentCharA, opponentCharB],
          deck: 1,
        },
        {
          play: [{ card: miloThatchKingOfAtlantis, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(challenger, miloThatchKingOfAtlantis),
      ).toBeSuccessfulCommand();

      resolveMiloBag(testEngine);

      // All of player one's characters should be returned to hand
      expect(testEngine.asPlayerOne().getCardZone(challenger)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(opponentCharA)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(opponentCharB)).toBe("hand");
      // Milo is in discard
      expect(testEngine.asPlayerTwo().getCardZone(miloThatchKingOfAtlantis)).toBe("discard");
    });
  });
});
