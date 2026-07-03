import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { miriamMendelsohnTicketHolder } from "./009-miriam-mendelsohn-ticket-holder";

const playerOneDraw = createMockCharacter({
  id: "miriam-player-one-draw",
  name: "Player One Draw",
  cost: 1,
});

const playerTwoDraw = createMockCharacter({
  id: "miriam-player-two-draw",
  name: "Player Two Draw",
  cost: 1,
});

describe("Miriam Mendelsohn - Ticket Holder", () => {
  it("draws a card for each player when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [miriamMendelsohnTicketHolder],
        inkwell: miriamMendelsohnTicketHolder.cost,
        deck: [playerOneDraw],
      },
      {
        deck: [playerTwoDraw],
      },
    );

    expect(testEngine.asPlayerOne().playCard(miriamMendelsohnTicketHolder)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(playerOneDraw)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(playerTwoDraw)).toBe("hand");
  });
});
