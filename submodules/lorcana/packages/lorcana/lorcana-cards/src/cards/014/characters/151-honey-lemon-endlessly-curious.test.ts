import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { honeyLemonEndlesslyCurious } from "./151-honey-lemon-endlessly-curious";

const priceyItem = createMockItem({ id: "hl-item", name: "Gadget", cost: 2 });

describe("Honey Lemon - Endlessly Curious", () => {
  it("Player Two consumes all stacked reductions on one cheap item and pays full cost afterward", () => {
    const cheap = createMockItem({ id: "hl-p2-cheap", name: "Cheap", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [priceyItem], inkwell: 1 },
      {
        play: [
          { card: honeyLemonEndlesslyCurious, isDrying: false },
          { card: honeyLemonEndlesslyCurious, isDrying: false },
        ],
        hand: [cheap, priceyItem],
        inkwell: 2,
      },
    );
    const copies = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(copies[0]!)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(copies[1]!)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(cheap)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(
      g.asPlayerTwo().playCard(g.findCardInstanceId(priceyItem, "hand", PLAYER_TWO)!),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(1);
    expect(g.getCardInstanceIdsInZone("play", PLAYER_ONE)).toHaveLength(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });

  it("a failed expensive item play does not consume the reduction", () => {
    const expensive = createMockItem({ id: "hl-expensive", name: "Expensive", cost: 3 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: honeyLemonEndlesslyCurious, isDrying: false }],
      hand: [expensive, priceyItem],
      inkwell: 1,
    });
    expect(g.asPlayerOne().quest(honeyLemonEndlesslyCurious)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(expensive)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(expensive)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(priceyItem)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("another character's quest does not grant an item reduction", () => {
    const other = createMockCharacter({ id: "hl-other-quest", name: "Other", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: honeyLemonEndlesslyCurious, isDrying: false },
        { card: other, isDrying: false },
      ],
      hand: [priceyItem],
      inkwell: 1,
    });
    expect(g.asPlayerOne().quest(other)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(priceyItem)).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(priceyItem)).toBe("hand");
  });

  it("two quest triggers combine on the next item and are both consumed", () => {
    const second = createMockItem({ id: "hl-stack-second", name: "Second Item", cost: 2 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: honeyLemonEndlesslyCurious, isDrying: false },
        { card: honeyLemonEndlesslyCurious, isDrying: false },
      ],
      hand: [priceyItem, second],
      inkwell: 1,
    });
    const copies = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(g.asPlayerOne().quest(copies[0]!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(copies[1]!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().playCard(priceyItem)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(second)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(second)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });
  it("can reduce a one-cost item to zero without creating ink", () => {
    const cheap = createMockItem({ id: "hl-cheap", name: "Cheap Gadget", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheap],
      play: [{ card: honeyLemonEndlesslyCurious, isDrying: false }],
      inkwell: 0,
    });
    expect(g.asPlayerOne().quest(honeyLemonEndlesslyCurious)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(cheap)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardZone(cheap)).toBe("play");
  });
  it("discounts only the next item and charges the second item's full cost", () => {
    const second = createMockItem({ id: "hl-second", name: "Second Gadget", cost: 2 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [priceyItem, second],
      play: [{ card: honeyLemonEndlesslyCurious, isDrying: false }],
      inkwell: 3,
    });
    expect(g.asPlayerOne().quest(honeyLemonEndlesslyCurious)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(priceyItem)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().playCard(second)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("playing a character does not consume the item discount", () => {
    const character = createMockCharacter({ id: "hl-character", name: "Character", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [character, priceyItem],
      play: [{ card: honeyLemonEndlesslyCurious, isDrying: false }],
      inkwell: 2,
    });
    expect(g.asPlayerOne().quest(honeyLemonEndlesslyCurious)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(character)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(priceyItem)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("an unused discount expires when the turn ends", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [priceyItem],
      play: [{ card: honeyLemonEndlesslyCurious, isDrying: false }],
      inkwell: 1,
    });
    expect(g.asPlayerOne().quest(honeyLemonEndlesslyCurious)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(priceyItem)).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(priceyItem)).toBe("hand");
  });
  it("on quest, discounts the next item play by 1 {I}", () => {
    // Exactly 1 ready ink at the item play: the 2-cost item is only playable
    // at its discounted cost of 1, so the test proves the reduction.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [honeyLemonEndlesslyCurious, priceyItem],
      inkwell: 1,
    });

    expect(testEngine.asPlayerOne().playCard(honeyLemonEndlesslyCurious)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(honeyLemonEndlesslyCurious)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(priceyItem)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(priceyItem)).toBe("play");
  });
});
