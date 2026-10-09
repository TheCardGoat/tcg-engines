import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { elisaMazaHardworkingDetective } from "./016-elisa-maza-hardworking-detective";

const fellowDetective = createMockCharacter({
  id: "elisa-fellow-detective",
  name: "Fellow Detective",
  cost: 2,
  classifications: ["Storyborn", "Detective"],
});

const nonDetective = createMockCharacter({
  id: "elisa-non-detective",
  name: "Non Detective",
  cost: 2,
  classifications: ["Storyborn", "Ally"],
});

const opponentItem = createMockItem({
  id: "elisa-opponent-item",
  name: "Mystery Item",
  cost: 2,
});

const opponentCharacter = createMockCharacter({
  id: "elisa-opponent-character",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Elisa Maza - Hardworking Detective", () => {
  it("makes chosen opponent reveal their hand and discard a non-character card of your choice when you have another Detective", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaHardworkingDetective],
        inkwell: elisaMazaHardworkingDetective.cost,
        play: [fellowDetective],
        deck: 6,
      },
      {
        hand: [opponentItem, opponentCharacter],
        deck: 6,
      },
    );

    const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(elisaMazaHardworkingDetective),
    ).toBeSuccessfulCommand();

    // Controller chooses the non-character card to discard.
    const itemCardId = testEngine.findCardInstanceId(opponentItem, "hand", PLAYER_TWO);
    expect(testEngine.asPlayerOne().respondWith(itemCardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");

    // All opponent hand cards were revealed.
    const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
    for (const cardId of opponentHandIds) {
      expect(cardMeta?.[cardId]?.revealed).toBe(true);
    }
  });

  it("does not trigger without another Detective character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaHardworkingDetective],
        inkwell: elisaMazaHardworkingDetective.cost,
        play: [nonDetective],
        deck: 6,
      },
      {
        hand: [opponentItem, opponentCharacter],
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(elisaMazaHardworkingDetective),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
  });

  it("does not count Elisa herself or an opposing Detective", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaHardworkingDetective],
        inkwell: elisaMazaHardworkingDetective.cost,
        deck: 6,
      },
      { play: [fellowDetective], hand: [opponentItem], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(elisaMazaHardworkingDetective)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerTwo().getCardZone(opponentItem)).toBe("hand");
  });

  it("allows only Elisa's controller to choose a non-character card", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaHardworkingDetective],
        play: [fellowDetective],
        inkwell: elisaMazaHardworkingDetective.cost,
        deck: 6,
      },
      { hand: [opponentItem, opponentCharacter], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(elisaMazaHardworkingDetective)).toBeSuccessfulCommand();
    const itemId = engine.findCardInstanceId(opponentItem, "hand", PLAYER_TWO);
    const characterId = engine.findCardInstanceId(opponentCharacter, "hand", PLAYER_TWO);
    expect(engine.asPlayerTwo().respondWith(itemId)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().respondWith(characterId)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().respondWith(itemId)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
    expect(engine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
  });

  it("finishes without a discard if the revealed hand has only characters", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [elisaMazaHardworkingDetective],
        play: [fellowDetective],
        inkwell: elisaMazaHardworkingDetective.cost,
        deck: 6,
      },
      { hand: [opponentCharacter], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(elisaMazaHardworkingDetective)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
    const characterId = engine.findCardInstanceId(opponentCharacter, "hand", PLAYER_TWO);
    expect(engine.getAuthoritativeState().ctx.zones.private.cardMeta?.[characterId]?.revealed).toBe(
      true,
    );
  });
  it("finishes when the opponent has an empty hand", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [elisaMazaHardworkingDetective], play: [fellowDetective], inkwell: 4, deck: 6 },
      { hand: [], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(elisaMazaHardworkingDetective)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toHaveLength(0);
  });

  it("discards exactly the controller's chosen non-character from several choices", () => {
    const secondItem = { ...opponentItem, id: "elisa-second-item" };
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [elisaMazaHardworkingDetective], play: [fellowDetective], inkwell: 4, deck: 6 },
      { hand: [opponentItem, secondItem, opponentCharacter], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(elisaMazaHardworkingDetective)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().respondWith(game.findCardInstanceId(secondItem, "hand", PLAYER_TWO)),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(secondItem)).toBe("discard");
    expect(game.asPlayerTwo().getCardZone(opponentItem)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("lets Player Two choose the discard from Player One's hand", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [opponentItem, opponentCharacter], deck: 6 },
      { hand: [elisaMazaHardworkingDetective], play: [fellowDetective], inkwell: 4, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(elisaMazaHardworkingDetective)).toBeSuccessfulCommand();
    const itemId = game.findCardInstanceId(opponentItem, "hand", PLAYER_ONE);
    expect(game.asPlayerOne().respondWith(itemId).success).toBe(false);
    expect(game.asPlayerOne().getCardZone(opponentItem)).toBe("hand");
    expect(game.asPlayerTwo().respondWith(itemId)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(opponentItem)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(opponentCharacter)).toBe("hand");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("an earlier Player Two Elisa qualifies later copies, but the first copy and opposing Detective do not", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [fellowDetective], hand: [opponentItem, opponentCharacter], deck: 6 },
      {
        hand: [
          elisaMazaHardworkingDetective,
          elisaMazaHardworkingDetective,
          elisaMazaHardworkingDetective,
        ],
        inkwell: 12,
        deck: 6,
      },
    );
    const copies = game.getCardInstanceIdsInZone("hand", PLAYER_TWO);
    const itemId = game.findCardInstanceId(opponentItem, "hand", PLAYER_ONE);
    const characterId = game.findCardInstanceId(opponentCharacter, "hand", PLAYER_ONE);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(copies[0]!)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
    for (const id of [itemId, characterId]) {
      expect(game.getAuthoritativeState().ctx.zones.private.cardMeta?.[id]?.revealed).not.toBe(
        true,
      );
    }
    expect(game.asPlayerTwo().playCard(copies[1]!)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().respondWith(itemId)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().respondWith(characterId)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().respondWith(itemId)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(itemId)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(characterId)).toBe("hand");
    expect(game.asPlayerTwo().playCard(copies[2]!)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(1);
    expect(game.getAuthoritativeState().ctx.zones.private.cardMeta?.[characterId]?.revealed).toBe(
      true,
    );
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
});
