import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { princePhillipSwordsmanOfTheRealm } from "./083-prince-phillip-swordsman-of-the-realm";

const dragonCharacter = createMockCharacter({
  id: "pp-swordsman-dragon",
  name: "Dragon Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Dragon"],
});

const nonDragonCharacter = createMockCharacter({
  id: "pp-swordsman-non-dragon",
  name: "Non Dragon Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const damagedDefender = createMockCharacter({
  id: "pp-swordsman-damaged-defender",
  name: "Damaged Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
  lore: 1,
});

const undamagedDefender = createMockCharacter({
  id: "pp-swordsman-undamaged-defender",
  name: "Undamaged Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
  lore: 1,
});

describe("Prince Phillip - Swordsman of the Realm", () => {
  describe("SLAYER OF DRAGONS - When you play this character, banish chosen opposing Dragon character.", () => {
    it("banishes chosen opposing Dragon character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipSwordsmanOfTheRealm],
          inkwell: princePhillipSwordsmanOfTheRealm.cost,
        },
        {
          play: [dragonCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipSwordsmanOfTheRealm),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(princePhillipSwordsmanOfTheRealm, {
          targets: [dragonCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(dragonCharacter)).toBe("discard");
    });

    it("does not banish non-Dragon opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipSwordsmanOfTheRealm],
          inkwell: princePhillipSwordsmanOfTheRealm.cost,
        },
        {
          play: [nonDragonCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipSwordsmanOfTheRealm),
      ).toBeSuccessfulCommand();

      // No valid Dragon targets, should auto-resolve without bag effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(nonDragonCharacter)).toBe("play");
    });
  });

  describe("PRESSING THE ADVANTAGE - Whenever he challenges a damaged character, ready this character after the challenge.", () => {
    it("readies itself after challenging a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: princePhillipSwordsmanOfTheRealm, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: damagedDefender, exerted: true, damage: 1 }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(princePhillipSwordsmanOfTheRealm, damagedDefender),
      ).toBeSuccessfulCommand();

      // After challenging a damaged character, Prince Phillip should be readied
      expect(testEngine.asPlayerOne().getCard(princePhillipSwordsmanOfTheRealm).exerted).toBe(
        false,
      );
    });

    it("does not ready itself after challenging an undamaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: princePhillipSwordsmanOfTheRealm, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: undamagedDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(princePhillipSwordsmanOfTheRealm, undamagedDefender),
      ).toBeSuccessfulCommand();

      // After challenging an undamaged character, Prince Phillip should remain exerted
      expect(testEngine.asPlayerOne().getCard(princePhillipSwordsmanOfTheRealm).exerted).toBe(true);
    });
  });
});
