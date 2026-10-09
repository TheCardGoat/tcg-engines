import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { spyglassHat } from "./168-spyglass-hat";

const uniqueItem = createMockItem({ id: "spyglass-unique", name: "Novel Gadget", cost: 2 });
const hatCopy = createMockItem({ id: "spyglass-copy", name: "Spyglass Hat", cost: 3 });
const inkFodder = createMockCharacter({ id: "spyglass-fodder", name: "Ink Fodder", cost: 2 });

describe("Spyglass Hat", () => {
  it("an empty hand finishes the optional effect without adding ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [spyglassHat], inkwell: 3, deck: [inkFodder, inkFodder] },
      { deck: [inkFodder, inkFodder] },
    );
    expect(g.asPlayerOne().playCard(spyglassHat)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("two Hats each grant an independent choice for a uniquely named item", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [spyglassHat, spyglassHat],
      hand: [uniqueItem, inkFodder, inkFodder],
      inkwell: 2,
    });
    const [firstHat, secondHat] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    const [firstCard, secondCard] = g
      .getCardInstanceIdsInZone("hand", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === inkFodder.id);
    expect(g.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(firstHat!, { resolveOptional: true, targets: [firstCard!] }),
    ).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(secondHat!, { resolveOptional: true, targets: [secondCard!] }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(4);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    for (const card of [firstCard!, secondCard!]) {
      expect(g.isExerted(card)).toBe(true);
      expect(g.isCardFaceDown(card, "inkwell", PLAYER_ONE)).toBe(true);
    }
  });

  it("the other-item target prompt retains the second engine branch index", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [spyglassHat],
      hand: [uniqueItem, inkFodder],
      inkwell: 2,
    });
    expect(g.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBoard().bagEffects[0]?.selectionContext?.kind).toBe(
      "target-selection",
    );
    expect(
      g.asPlayerOne().resolvePendingByCard(spyglassHat, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ payload: expect.objectContaining({ abilityIndex: 1 }) }),
      ]),
    );
  });

  it("a second real Hat does not trigger either copy", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [spyglassHat, inkFodder],
      play: [spyglassHat],
      inkwell: 3,
    });
    const handHat = g.findCardInstanceId(spyglassHat, "hand", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(handHat)).toBeSuccessfulCommand();
    // A false-condition bag entry must not expose a target picker.
    expect(g.asPlayerOne().getBoard().bagEffects.length).toBeGreaterThan(0);
    for (const entry of g.asPlayerOne().getBoard().bagEffects) {
      expect(entry.selectionContext).toBeUndefined();
    }
    // A false-condition bag entry can be drained successfully without its effect.
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(handHat, { resolveOptional: true, targets: [inkFodder] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
  });

  it("player two inks only the chosen own duplicate hand card", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [inkFodder, inkFodder], inkwell: 2 },
      {
        hand: [uniqueItem, inkFodder, inkFodder],
        play: [spyglassHat],
        inkwell: 2,
        deck: [hatCopy, hatCopy],
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const [selected, untouched] = g
      .getCardInstanceIdsInZone("hand", PLAYER_TWO)
      .filter((id) => g.getCardDefinitionId(id) === inkFodder.id);
    expect(g.asPlayerTwo().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(spyglassHat, { resolveOptional: true, targets: [selected!] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(spyglassHat, { resolveOptional: true, targets: [selected!] }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(selected!);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toContain(untouched!);
    expect(g.isExerted(selected!)).toBe(true);
    expect(g.isCardFaceDown(selected!, "inkwell", PLAYER_TWO)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("ordinary inking does not trigger Hat Couture", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [spyglassHat, inkFodder] });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, spyglassHat)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(spyglassHat, { resolveOptional: true, targets: [inkFodder] }),
    ).not.toBeSuccessfulCommand();
  });

  it("its own first entry can ink a noninkable hand card facedown and exerted", () => {
    const noninkable = createMockCharacter({
      id: "hat-noninkable",
      name: "Noninkable",
      cost: 2,
      inkable: false,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [spyglassHat, noninkable],
      inkwell: 3,
    });
    expect(g.asPlayerOne().playCard(spyglassHat)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(spyglassHat, { resolveOptional: true, targets: [noninkable] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(noninkable)).toBe("inkwell");
    expect(g.isCardFaceDown(noninkable, "inkwell", PLAYER_ONE)).toBe(true);
    expect(g.isExerted(noninkable)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(4);
  });

  it("declining leaves the hand card and total ink unchanged after payment", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [uniqueItem, inkFodder],
      play: [spyglassHat],
      inkwell: 4,
    });
    expect(g.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(spyglassHat, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(4);
  });

  it("a played item matching another non-Hat item does not allow hand inking", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [uniqueItem, inkFodder],
      play: [spyglassHat, createMockItem({ id: "hat-matching", name: uniqueItem.name, cost: 2 })],
      inkwell: 4,
    });
    expect(g.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(spyglassHat, { resolveOptional: true, targets: [inkFodder] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(4);
  });

  it("an opponent item with the same name does not block your new item trigger", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [uniqueItem, inkFodder], play: [spyglassHat], inkwell: 4 },
      { play: [createMockItem({ id: "hat-opposing-match", name: uniqueItem.name, cost: 2 })] },
    );
    expect(g.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(spyglassHat, { resolveOptional: true, targets: [inkFodder] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(inkFodder)).toBe("inkwell");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
  });

  it("playing an item with a new name lets you ink a card from your hand facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [uniqueItem, inkFodder],
        inkwell: 4,
        play: [spyglassHat],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(spyglassHat, {
        resolveOptional: true,
        targets: [inkFodder],
      }),
    ).toBeSuccessfulCommand();

    // Inked facedown: it left the hand and joined the inkwell.
    expect(testEngine.asPlayerOne().getCardZone(inkFodder)).toBe("inkwell");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.isCardFaceDown(inkFodder, "inkwell", PLAYER_ONE)).toBe(true);
    expect(testEngine.isExerted(inkFodder)).toBe(true);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
  });

  it("doesn't trigger when the played item's name already matches an item in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hatCopy, inkFodder],
        inkwell: 6,
        play: [spyglassHat],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(hatCopy)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
  });
});

describe("Spyglass Hat payment and event boundaries", () => {
  it("failed self-entry keeps payment and hand unchanged and cannot trigger Couture", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [spyglassHat, inkFodder],
      inkwell: 2,
    });
    expect(g.asPlayerOne().playCard(spyglassHat)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(spyglassHat)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("character entry and opponent item entry do not trigger your Hat", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [spyglassHat], hand: [inkFodder, inkFodder], inkwell: 2, deck: 6 },
      { hand: [uniqueItem], inkwell: 2, deck: 6 },
    );
    const [played, untouched] = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(played!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getCardZone(untouched!)).toBe("hand");
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getCardZone(untouched!)).toBe("hand");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(2);
  });
});

describe("Spyglass Hat ink readiness", () => {
  it("ability ink stays exerted through the opponent turn and readies on your next turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [spyglassHat, inkFodder], inkwell: 3, deck: 6 },
      { deck: 6 },
    );
    expect(g.asPlayerOne().playCard(spyglassHat)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(spyglassHat, { resolveOptional: true, targets: [inkFodder] }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.isExerted(inkFodder)).toBe(true);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.isExerted(inkFodder)).toBe(true);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(g.isExerted(inkFodder)).toBe(false);
    expect(g.isCardFaceDown(inkFodder, "inkwell", PLAYER_ONE)).toBe(true);
  });
});
