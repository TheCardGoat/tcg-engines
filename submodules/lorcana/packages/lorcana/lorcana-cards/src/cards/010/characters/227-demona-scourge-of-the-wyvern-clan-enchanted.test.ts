import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { demonaScourgeOfTheWyvernClanEnchanted } from "./227-demona-scourge-of-the-wyvern-clan-enchanted";

const opposingCharacter = createMockCharacter({
  id: "demona-scourge-enchanted-opposing",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Demona - Scourge of the Wyvern Clan (Enchanted)", () => {
  it("exerts opposing characters and draws each player up to 3 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [demonaScourgeOfTheWyvernClanEnchanted],
        inkwell: demonaScourgeOfTheWyvernClanEnchanted.cost,
        deck: [opposingCharacter, opposingCharacter, opposingCharacter],
      },
      {
        play: [opposingCharacter],
        deck: [opposingCharacter, opposingCharacter, opposingCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(demonaScourgeOfTheWyvernClanEnchanted),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(3);
  });
});
