import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  PLAYER_ONE,
  createMockItem,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { clarabelleOutForAStroll } from "./160-clarabelle-out-for-a-stroll";

const bottomCard = createMockItem({ id: "clarabelle-bottom", name: "Bottom Card", cost: 1 });
const topCard = createMockItem({ id: "clarabelle-top", name: "Top Card", cost: 3 });

const enemyItem = createMockItem({ id: "clarabelle-item", name: "Enemy Gadget", cost: 2 });

describe("Clarabelle - Out for a Stroll", () => {
  it("inks a noninkable top card and readies it only on the item owner's next turn", () => {
    const noninkable = createMockCharacter({
      id: "clarabelle-noninkable",
      name: "Noninkable Top",
      cost: 1,
      inkable: false,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [clarabelleOutForAStroll], inkwell: 6, deck: 3 },
      {
        play: [enemyItem],
        deck: [
          createMockItem({ id: "clarabelle-keepalive", name: "Keepalive", cost: 1 }),
          bottomCard,
          noninkable,
        ],
        inkwell: 2,
      },
    );
    expect(g.asPlayerOne().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [enemyItem],
      }),
    ).toBeSuccessfulCommand();
    const inkId = g.findCardInstanceId(noninkable, "inkwell", PLAYER_TWO);
    expect(g.isCardFaceDown(inkId, "inkwell", PLAYER_TWO)).toBe(true);
    expect(g.isExerted(inkId)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.asPlayerOne().quest(clarabelleOutForAStroll)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.isExerted(inkId)).toBe(false);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(3);
    expect(g.isCardFaceDown(inkId, "inkwell", PLAYER_TWO)).toBe(true);
    expect(g.asPlayerTwo().getCardZone(bottomCard)).toBe("hand");
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("rejects items in hand and discard without moving deck cards, then accepts a played item", () => {
    const handItem = createMockItem({ id: "clarabelle-hand-item", name: "Hand Item", cost: 1 });
    const discardItem = createMockItem({
      id: "clarabelle-discard-item",
      name: "Discard Item",
      cost: 1,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [clarabelleOutForAStroll, handItem],
      discard: [discardItem],
      play: [enemyItem],
      inkwell: 6,
      deck: [bottomCard, topCard],
    });
    const originalDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    for (const item of [handItem, discardItem]) {
      expect(
        g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
          resolveOptional: true,
          targets: [item],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck);
      expect(g.asPlayerOne().getCardZone(enemyItem)).toBe("play");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    }
    expect(g.asPlayerOne().getCardZone(handItem)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(discardItem)).toBe("discard");
    expect(
      g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [enemyItem],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(enemyItem)).toBe("discard");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([bottomCard.id]);
    expect(g.isCardFaceDown(topCard, "inkwell", PLAYER_ONE)).toBe(true);
  });

  it("player two banishes only the selected duplicate and inks the item owner's top card", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [enemyItem, enemyItem], deck: [bottomCard, topCard], inkwell: 2 },
      { hand: [clarabelleOutForAStroll], inkwell: 6, deck: 3 },
    );
    const [chosenId, otherId] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [chosenId!],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [chosenId!],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("play", PLAYER_ONE)).toEqual([otherId!]);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual([chosenId!]);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([bottomCard.id]);
    expect(g.getCardDefinitionIdsInZone("inkwell", PLAYER_ONE)).toContain(topCard.id);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("no items in play resolves without a target or deck movement", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [clarabelleOutForAStroll], inkwell: 6, deck: [bottomCard, topCard] },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([bottomCard.id, topCard.id]);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("rejects a character target and permits an item retry", () => {
    const character = createMockCharacter({
      id: "clarabelle-character",
      name: "Character",
      cost: 1,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [clarabelleOutForAStroll], inkwell: 6, deck: 3 },
      { play: [character, enemyItem], deck: [bottomCard, topCard] },
    );
    expect(g.asPlayerOne().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [character],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(character)).toBe("play");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_TWO)).toEqual([bottomCard.id, topCard.id]);
    expect(
      g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [enemyItem],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(enemyItem)).toBe("discard");
  });

  it("failed payment preserves hand and ink with no trigger", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [clarabelleOutForAStroll], inkwell: 5, deck: 3 },
      { play: [enemyItem], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(clarabelleOutForAStroll)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(clarabelleOutForAStroll)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(5);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerTwo().getCardZone(enemyItem)).toBe("play");
  });

  it("can be inked without an item-removal trigger", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [clarabelleOutForAStroll], deck: 3 },
      { play: [enemyItem], deck: 3 },
    );
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, clarabelleOutForAStroll),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerTwo().getCardZone(enemyItem)).toBe("play");
  });

  it("banishing your own item inks your own top card and leaves the opponent unchanged", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [clarabelleOutForAStroll],
        play: [enemyItem],
        inkwell: 6,
        deck: [bottomCard, topCard],
      },
      { deck: [topCard, bottomCard], inkwell: 2 },
    );
    const opponentDeck = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerOne().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [enemyItem],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(enemyItem)).toBe("discard");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([bottomCard.id]);
    expect(g.getCardDefinitionIdsInZone("inkwell", PLAYER_ONE)).toContain(topCard.id);
    const ownTop = g.findCardInstanceId(topCard, "inkwell", PLAYER_ONE);
    expect(g.isCardFaceDown(ownTop, "inkwell", PLAYER_ONE)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(opponentDeck);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
  });

  it("still banishes an item when its player's deck is empty", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [clarabelleOutForAStroll], inkwell: 6, deck: 3 },
      { play: [enemyItem], deck: [], inkwell: 2 },
    );
    expect(g.asPlayerOne().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [enemyItem],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(enemyItem)).toBe("discard");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(2);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asServer().getWinner()).toBeUndefined();
  });

  it("banishing an opponent item mills their top card into their inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [clarabelleOutForAStroll],
        inkwell: clarabelleOutForAStroll.cost,
      },
      {
        play: [enemyItem],
        deck: [bottomCard, topCard],
      },
    );

    expect(testEngine.asPlayerOne().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: true,
        targets: [enemyItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(enemyItem)).toBe("discard");
    expect(testEngine.getCardDefinitionIdsInZone("inkwell", PLAYER_TWO)).toEqual([topCard.id]);
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO)).toEqual([bottomCard.id]);
    expect(testEngine.isCardFaceDown(topCard, "inkwell", PLAYER_TWO)).toBe(true);
    expect(testEngine.asPlayerTwo().getCard(topCard).exerted).toBe(true);
    expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("declining banishes nothing and mills nothing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [clarabelleOutForAStroll],
        inkwell: clarabelleOutForAStroll.cost,
      },
      {
        play: [enemyItem],
        deck: [bottomCard, topCard],
      },
    );

    expect(testEngine.asPlayerOne().playCard(clarabelleOutForAStroll)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(clarabelleOutForAStroll, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(enemyItem)).toBe("play");
    expect(testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(0);
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO)).toEqual([
      bottomCard.id,
      topCard.id,
    ]);
  });
});
