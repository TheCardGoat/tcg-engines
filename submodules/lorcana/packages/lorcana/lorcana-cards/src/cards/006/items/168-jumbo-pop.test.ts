import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jumboPop } from "./168-jumbo-pop";

const refreshedFriend = createMockCharacter({
  id: "jumbo-pop-refreshed-friend",
  name: "Refreshed Friend",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const lightlyDamagedFriend = createMockCharacter({
  id: "jumbo-pop-lightly-damaged-friend",
  name: "Lightly Damaged Friend",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const drawnCard = createMockCharacter({
  id: "jumbo-pop-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Jumbo Pop", () => {
  it("heals each of your characters and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      play: [
        jumboPop,
        { card: refreshedFriend, damage: 3 },
        { card: lightlyDamagedFriend, damage: 1 },
      ],
    });

    expect(testEngine.asPlayerOne().activateAbility(jumboPop)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(jumboPop)).toBe("discard");
    expect(testEngine.asPlayerOne().getCard(refreshedFriend)?.damage).toBe(1);
    expect(testEngine.asPlayerOne().getCard(lightlyDamagedFriend)?.damage).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });
});
