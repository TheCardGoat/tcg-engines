import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { merlinsCottageTheWizardsHome } from "./170-merlins-cottage-the-wizards-home";

const bottomCard = createMockCharacter({ id: "merlin-bottom", name: "Merlin Bottom", cost: 1 });
const topCard = createMockCharacter({ id: "merlin-top", name: "Merlin Top", cost: 1 });
const opponentTop = createMockCharacter({
  id: "merlin-opponent-top",
  name: "Opponent Top",
  cost: 1,
});

describe("Merlin's Cottage - The Wizard's Home", () => {
  it("projects the top card of each deck face up while the location is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [merlinsCottageTheWizardsHome],
        deck: [bottomCard, topCard],
      },
      {
        deck: [opponentTop],
      },
    );

    const playerOneBoard = testEngine.getBoard("playerOne");
    const playerTwoBoard = testEngine.getBoard("playerTwo");
    const playerOneTopId = playerOneBoard.players[PLAYER_ONE].deckTop as string;
    const playerTwoTopId = playerTwoBoard.players[PLAYER_TWO].deckTop as string;

    expect(playerOneBoard.cards[playerOneTopId]?.definitionId).toBe(topCard.id);
    expect(playerTwoBoard.cards[playerTwoTopId]?.definitionId).toBe(opponentTop.id);
  });

  it("does not project deck tops once the location is absent", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [topCard],
    });

    expect(testEngine.getBoard("playerOne").players[PLAYER_ONE].deckTop).toBeUndefined();
  });
});
