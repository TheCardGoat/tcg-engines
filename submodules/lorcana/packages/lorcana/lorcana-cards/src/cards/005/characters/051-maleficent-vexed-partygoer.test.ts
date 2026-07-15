import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { maleficentVexedPartygoer } from "./051-maleficent-vexed-partygoer";

const handFodder = createMockCharacter({
  id: "maleficent-hand-fodder",
  name: "Hand Fodder",
  cost: 1,
});

const cheapCharacter = createMockCharacter({
  id: "maleficent-cheap-character",
  name: "Cheap Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const expensiveCharacter = createMockCharacter({
  id: "maleficent-expensive-character",
  name: "Expensive Character",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
});

const cheapItem = createMockItem({
  id: "maleficent-cheap-item",
  name: "Cheap Item",
  cost: 2,
});

const cheapLocation = createMockLocation({
  id: "maleficent-cheap-location",
  name: "Cheap Location",
  cost: 3,
  lore: 1,
  willpower: 4,
});

describe("Maleficent - Vexed Partygoer", () => {
  it("has the expected printed metadata", () => {
    expect(maleficentVexedPartygoer).toMatchObject({
      id: "3T9",
      canonicalId: "ci_3T9",
      cardType: "character",
      name: "Maleficent",
      version: "Vexed Partygoer",
      set: "005",
      cardNumber: 51,
      cost: 3,
      strength: 0,
      willpower: 4,
      lore: 2,
      inkable: true,
    });
  });

  describe("WHAT AN AWKWARD SITUATION - Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.", () => {
    it("discards a card and returns opponent's character with cost 3 or less to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maleficentVexedPartygoer, isDrying: false }],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [cheapCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(maleficentVexedPartygoer)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(maleficentVexedPartygoer.lore);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentVexedPartygoer, {
          resolveOptional: true,
          targets: [handFodder, cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(cheapCharacter)).toBe("hand");
    });

    it("can return own character with cost 3 or less to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: maleficentVexedPartygoer, isDrying: false }, cheapCharacter],
        hand: [handFodder],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(maleficentVexedPartygoer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentVexedPartygoer, {
          resolveOptional: true,
          targets: [handFodder, cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
    });

    it("can return an item with cost 3 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maleficentVexedPartygoer, isDrying: false }],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [cheapItem],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(maleficentVexedPartygoer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentVexedPartygoer, {
          resolveOptional: true,
          targets: [handFodder, cheapItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(cheapItem)).toBe("hand");
    });

    it("can return a location with cost 3 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maleficentVexedPartygoer, isDrying: false }],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [cheapLocation],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(maleficentVexedPartygoer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentVexedPartygoer, {
          resolveOptional: true,
          targets: [handFodder, cheapLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(cheapLocation)).toBe("hand");
    });

    it("cannot return a character with cost greater than 3", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maleficentVexedPartygoer, isDrying: false }],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [expensiveCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(maleficentVexedPartygoer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentVexedPartygoer, {
          resolveOptional: true,
          targets: [handFodder],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(expensiveCharacter)).toBe("play");
    });
  });
});
