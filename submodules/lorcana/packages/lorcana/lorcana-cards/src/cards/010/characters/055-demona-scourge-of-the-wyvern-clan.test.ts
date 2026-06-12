import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { demonaScourgeOfTheWyvernClan } from "./055-demona-scourge-of-the-wyvern-clan";

const opposingCharacterA = createMockCharacter({
  id: "demona-scourge-opposing-a",
  name: "Opposing A",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const opposingCharacterB = createMockCharacter({
  id: "demona-scourge-opposing-b",
  name: "Opposing B",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Demona - Scourge of the Wyvern Clan", () => {
  it("AD SAXUM COMMUTATE - exerts all opposing characters and each player draws until they have 3 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [demonaScourgeOfTheWyvernClan],
        inkwell: demonaScourgeOfTheWyvernClan.cost,
        deck: [opposingCharacterA, opposingCharacterA, opposingCharacterA],
      },
      {
        play: [opposingCharacterA, opposingCharacterB],
        deck: [opposingCharacterB, opposingCharacterB, opposingCharacterB],
      },
    );

    expect(testEngine.asPlayerOne().playCard(demonaScourgeOfTheWyvernClan)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(opposingCharacterA)).toBe(true);
    expect(testEngine.asPlayerTwo().isExerted(opposingCharacterB)).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(3);
  });

  it("regression: STONE BY DAY prevents Demona from being readied when controller has 3+ cards in hand", () => {
    const handCard1 = createMockCharacter({
      id: "demona-hand-1",
      name: "Hand Card 1",
      cost: 1,
    });
    const handCard2 = createMockCharacter({
      id: "demona-hand-2",
      name: "Hand Card 2",
      cost: 1,
    });
    const handCard3 = createMockCharacter({
      id: "demona-hand-3",
      name: "Hand Card 3",
      cost: 1,
    });

    const readyAction = createMockAction({
      id: "demona-ready-action",
      name: "Ready Action",
      cost: 1,
      text: "Ready chosen character.",
      abilities: [
        {
          type: "action",
          effect: {
            type: "ready",
            target: "CHOSEN_CHARACTER",
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: demonaScourgeOfTheWyvernClan, exerted: true, isDrying: false }],
      hand: [handCard1, handCard2, handCard3, readyAction],
      inkwell: readyAction.cost,
      deck: 5,
    });

    // Demona is exerted, player has 4 cards in hand (>= 3)
    // STONE BY DAY: "If you have 3 or more cards in your hand, this character can't ready."
    expect(testEngine.asPlayerOne().isExerted(demonaScourgeOfTheWyvernClan)).toBe(true);

    // Try to play the ready action targeting Demona — it should resolve without readying her
    const playResult = testEngine.asPlayerOne().playCard(readyAction, {
      targets: [demonaScourgeOfTheWyvernClan],
    });
    expect(playResult).toBeSuccessfulCommand();

    // Demona should still be exerted because cant-ready restriction
    expect(testEngine.asPlayerOne().isExerted(demonaScourgeOfTheWyvernClan)).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(demonaScourgeOfTheWyvernClan)).toBe(true);
  });

  it("regression: Demona CAN be readied when controller has fewer than 3 cards in hand", () => {
    const handCard1 = createMockCharacter({
      id: "demona-hand-single",
      name: "Hand Card",
      cost: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: demonaScourgeOfTheWyvernClan, exerted: true, isDrying: false }],
      hand: [handCard1],
      deck: 5,
    });

    // With only 1 card in hand (< 3), STONE BY DAY should not apply
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(demonaScourgeOfTheWyvernClan)).toBe(false);
  });
});
