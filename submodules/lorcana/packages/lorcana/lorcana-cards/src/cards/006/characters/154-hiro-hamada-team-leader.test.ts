import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hiroHamadaTeamLeader } from "./154-hiro-hamada-team-leader";

const inventorAlly = createMockCharacter({
  id: "hiro-inventor-ally",
  name: "Inventor Ally",
  cost: 2,
  classifications: ["Storyborn", "Inventor"],
});

const nonInventorAlly = createMockCharacter({
  id: "hiro-non-inventor-ally",
  name: "Non-Inventor Ally",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const topCard = createMockCharacter({
  id: "hiro-top-card",
  name: "Top Card",
  cost: 1,
});

const secondCard = createMockCharacter({
  id: "hiro-second-card",
  name: "Second Card",
  cost: 2,
});

describe("Hiro Hamada - Team Leader", () => {
  it("gives your other Inventor characters Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hiroHamadaTeamLeader, inventorAlly, nonInventorAlly],
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: inventorAlly,
      keyword: "Resist",
      value: 1,
    });
    expect(testEngine.hasKeyword(nonInventorAlly, "Resist")).toBe(false);
    expect(testEngine.hasKeyword(hiroHamadaTeamLeader, "Resist")).toBe(false);
  });

  it("looks at the top card and can put it on the bottom for 2 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      deck: [topCard, secondCard],
      play: [{ card: hiroHamadaTeamLeader, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().activateAbility(hiroHamadaTeamLeader)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [secondCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    expect(deckIds).toEqual([secondCard.id, topCard.id]);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
});
