import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { sourceOfTheVine } from "./072-source-of-the-vine";

// CR 1.8.1.1, 4.5.1-4.5.2, and 7.7.3.1-7.7.4.5 (v2.2.0): each quest completes,
// then its triggered abilities resolve; a player at 20 or more lore wins.
const firstQuester = createMockCharacter({
  id: "source-of-the-vine-first-quester",
  name: "First Quester",
  cost: 1,
  lore: 1,
});

const secondQuester = createMockCharacter({
  id: "source-of-the-vine-second-quester",
  name: "Second Quester",
  cost: 1,
  lore: 1,
});

describe("Source of the Vine", () => {
  it("lets the questing player pay 1 ink to prevent its controller from gaining lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [sourceOfTheVine], deck: 3 },
      {
        play: [{ card: firstQuester, isDrying: false }],
        inkwell: 1,
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(firstQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(sourceOfTheVine)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(1);
    expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("gains lore when the questing player cannot pay", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [sourceOfTheVine], deck: 3 },
      { play: [{ card: firstQuester, isDrying: false }], deck: 3 },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(firstQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(sourceOfTheVine)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("creates a separate payment decision for each opposing character that quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [sourceOfTheVine], deck: 3 },
      {
        play: [
          { card: firstQuester, isDrying: false },
          { card: secondQuester, isDrying: false },
        ],
        inkwell: 1,
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(firstQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(sourceOfTheVine)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);

    expect(testEngine.asPlayerTwo().quest(secondQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(sourceOfTheVine)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
  });

  it("creates a separate payment decision for each Source of the Vine in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [sourceOfTheVine, sourceOfTheVine], deck: 3 },
      {
        play: [{ card: firstQuester, isDrying: false }],
        inkwell: 2,
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(firstQuester)).toBeSuccessfulCommand();

    const siphonTriggers = testEngine.asPlayerOne().getBagEffects();
    expect(siphonTriggers).toHaveLength(2);

    expect(testEngine.asPlayerOne().resolveBag(siphonTriggers[0]!.id)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolveBag(siphonTriggers[1]!.id)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("wins for its controller immediately after an unpaid trigger reaches 20 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [sourceOfTheVine], lore: 18, deck: 3 },
      {
        play: [
          { card: firstQuester, isDrying: false },
          { card: secondQuester, isDrying: false },
        ],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(firstQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(sourceOfTheVine)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(19);

    expect(testEngine.asPlayerTwo().quest(secondQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(sourceOfTheVine)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(20);
    expect(testEngine.getAuthoritativeState().ctx.status).toMatchObject({
      gameEnded: true,
      winner: PLAYER_ONE,
    });
  });

  it("does not resolve Siphon if the quest itself makes the opposing player win", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [sourceOfTheVine], lore: 19, deck: 3 },
      {
        play: [{ card: firstQuester, isDrying: false }],
        lore: 19,
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(firstQuester)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(19);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(20);
    expect(testEngine.getAuthoritativeState().ctx.status).toMatchObject({
      gameEnded: true,
      winner: PLAYER_TWO,
    });
  });

  it("exerts itself and pays 2 ink to gain 1 lore with Radiant Bloom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sourceOfTheVine],
      inkwell: 2,
      deck: 3,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(sourceOfTheVine, {
        ability: "RADIANT BLOOM",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(sourceOfTheVine)).toBe(true);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
});
