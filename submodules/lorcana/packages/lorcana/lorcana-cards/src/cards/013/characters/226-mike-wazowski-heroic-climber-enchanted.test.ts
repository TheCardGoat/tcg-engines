import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mikeWazowskiHeroicClimberEnchanted } from "./226-mike-wazowski-heroic-climber-enchanted";

const playerOneFriend = createMockCharacter({
  id: "mike-heroic-climber-enchanted-player-one-friend",
  name: "Player One Friend",
  cost: 1,
});

const playerTwoFriend = createMockCharacter({
  id: "mike-heroic-climber-enchanted-player-two-friend",
  name: "Player Two Friend",
  cost: 1,
});

describe("Mike Wazowski - Heroic Climber Enchanted", () => {
  it("uses Find a Friend to reveal each player's top character card and let them put it into hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mikeWazowskiHeroicClimberEnchanted],
        inkwell: mikeWazowskiHeroicClimberEnchanted.cost,
        deck: [playerOneFriend],
      },
      {
        deck: [playerTwoFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(mikeWazowskiHeroicClimberEnchanted),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mikeWazowskiHeroicClimberEnchanted, {
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
