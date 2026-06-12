import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { clubDoor } from "./202-club-door";

const fatCat = createMockCharacter({
  id: "club-door-fat-cat",
  name: "Fat Cat",
  cost: 4,
});

const notFatCat = createMockCharacter({
  id: "club-door-not-fat-cat",
  name: "Not Fat Cat",
  cost: 2,
});

const lowCostAttacker = createMockCharacter({
  id: "club-door-low-cost-attacker",
  name: "Low Cost Attacker",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const highCostAttacker = createMockCharacter({
  id: "club-door-high-cost-attacker",
  name: "High Cost Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const protectedLocation = createMockLocation({
  id: "club-door-protected-location",
  name: "Protected Location",
  cost: 2,
  willpower: 5,
});

describe("Club Door", () => {
  describe("WELCOME BACK, SIR - If you have a character named Fat Cat in play, you may play this card for free.", () => {
    it("can be played for free when Fat Cat is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [clubDoor],
        play: [fatCat],
        inkwell: 0,
      });

      expect(testEngine.asPlayerOne().playCard(clubDoor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(clubDoor)).toBe("play");
    });

    it("cannot be played without enough ink when Fat Cat is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [clubDoor],
        inkwell: clubDoor.cost - 1,
      });

      expect(testEngine.asPlayerOne().playCard(clubDoor).success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(clubDoor)).toBe("hand");
    });

    it("can be played at full cost when Fat Cat is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [clubDoor],
        inkwell: clubDoor.cost,
      });

      expect(testEngine.asPlayerOne().playCard(clubDoor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(clubDoor)).toBe("play");
    });

    it("discount does not apply when only a non-Fat Cat character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [clubDoor],
        play: [notFatCat],
        inkwell: clubDoor.cost - 1,
      });

      expect(testEngine.asPlayerOne().playCard(clubDoor).success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(clubDoor)).toBe("hand");
    });
  });

  describe("COOL CATS ONLY - Your locations can't be challenged by characters with cost 2 or less.", () => {
    it("prevents a character with cost 2 or less from challenging your locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [clubDoor, protectedLocation],
        },
        {
          play: [lowCostAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().challenge(lowCostAttacker, protectedLocation).success).toBe(
        false,
      );
    });

    it("allows a character with cost greater than 2 to challenge your locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [clubDoor, protectedLocation],
        },
        {
          play: [highCostAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(highCostAttacker, protectedLocation),
      ).toBeSuccessfulCommand();
    });
  });
});
