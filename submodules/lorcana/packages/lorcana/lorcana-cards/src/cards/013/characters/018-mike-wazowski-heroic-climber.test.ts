import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mikeWazowskiHeroicClimber } from "./018-mike-wazowski-heroic-climber";

const playerOneFriend = createMockCharacter({
  id: "mike-heroic-climber-player-one-friend",
  name: "Player One Friend",
  cost: 1,
});

const playerTwoFriend = createMockCharacter({
  id: "mike-heroic-climber-player-two-friend",
  name: "Player Two Friend",
  cost: 1,
});

describe("Mike Wazowski - Heroic Climber", () => {
  it("reveals each player's top character card and lets them put it into hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mikeWazowskiHeroicClimber],
        inkwell: mikeWazowskiHeroicClimber.cost,
        deck: [playerOneFriend],
      },
      {
        deck: [playerTwoFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(mikeWazowskiHeroicClimber)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mikeWazowskiHeroicClimber, {
        destinations: [{ zone: "hand", cards: [playerOneFriend] }],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        destinations: [{ zone: "hand", cards: [playerTwoFriend] }],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(playerOneFriend)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(playerTwoFriend)).toBe("hand");
  });

  it("also reveals each player's top character card when he quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mikeWazowskiHeroicClimber],
        deck: [playerOneFriend],
      },
      {
        deck: [playerTwoFriend],
      },
    );

    expect(testEngine.asPlayerOne().quest(mikeWazowskiHeroicClimber)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mikeWazowskiHeroicClimber, {
        destinations: [{ zone: "hand", cards: [playerOneFriend] }],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        destinations: [{ zone: "hand", cards: [playerTwoFriend] }],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(playerOneFriend)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(playerTwoFriend)).toBe("hand");
  });
});
