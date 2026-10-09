import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { nickWildeToyDriveOfficer } from "./014-nick-wilde-toy-drive-officer";

const cheapCharacterA = createMockCharacter({
  id: "nick-td-cheap-a",
  name: "Cheap Ally A",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const cheapCharacterB = createMockCharacter({
  id: "nick-td-cheap-b",
  name: "Cheap Ally B",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const drawnCard = createMockCharacter({
  id: "nick-td-drawn",
  name: "Drawn Card",
  cost: 1,
});

describe("Nick Wilde - Toy Drive Officer", () => {
  it("draws a card at end of turn after playing 2 or more characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapCharacterA, cheapCharacterB],
      inkwell: 2,
      play: [nickWildeToyDriveOfficer],
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(cheapCharacterA)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(cheapCharacterB)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });

  it("does not draw after playing fewer than 2 characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapCharacterA],
      inkwell: 1,
      play: [nickWildeToyDriveOfficer],
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(cheapCharacterA)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });

  it.each([1, 2])(
    "draws once after his own play plus %i other characters",
    (otherCount: number) => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [
            nickWildeToyDriveOfficer,
            cheapCharacterA,
            ...(otherCount === 2 ? [cheapCharacterB] : []),
          ],
          inkwell: nickWildeToyDriveOfficer.cost + 2,
          deck: [drawnCard, drawnCard],
        },
        { deck: 3 },
      );
      expect(engine.asPlayerOne().playCard(nickWildeToyDriveOfficer)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().playCard(cheapCharacterA)).toBeSuccessfulCommand();
      if (otherCount === 2)
        expect(engine.asPlayerOne().playCard(cheapCharacterB)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(1);
    },
  );

  it("does not draw at the end of the opponent's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [nickWildeToyDriveOfficer], deck: [drawnCard, drawnCard, drawnCard] },
      { hand: [cheapCharacterA, cheapCharacterB], inkwell: 2, deck: 3 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(cheapCharacterA)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(cheapCharacterB)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    // Only the normal start-of-turn draw enters our hand.
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(2);
  });

  it("does not count an action toward the two-character threshold", () => {
    const action = createMockAction({ id: "nick-toy-action", name: "Action", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [nickWildeToyDriveOfficer],
        hand: [cheapCharacterA, action],
        inkwell: 2,
        deck: [drawnCard, drawnCard],
      },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(cheapCharacterA)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(2);
  });
  it("draws only for Player Two after their own two character plays", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [nickWildeToyDriveOfficer], deck: 6 },
      {
        hand: [cheapCharacterA, cheapCharacterB],
        play: [nickWildeToyDriveOfficer],
        inkwell: 2,
        deck: [drawnCard, drawnCard, drawnCard],
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(cheapCharacterA)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(cheapCharacterB)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(2);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(5);
  });

  it("each Player Two copy draws once and the character count resets next turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [nickWildeToyDriveOfficer], deck: 6 },
      {
        play: [nickWildeToyDriveOfficer, nickWildeToyDriveOfficer],
        hand: [cheapCharacterA, cheapCharacterB],
        inkwell: 2,
        deck: 8,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(cheapCharacterA)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(cheapCharacterB)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(2);
    const nick = game
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .find(
        (id) =>
          game.asServer().getCardDefinitionByInstanceId(id).id === nickWildeToyDriveOfficer.id,
      )!;
    expect(game.asPlayerTwo().resolvePendingByCard(nick)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(3);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(5);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(4);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(4);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(4);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
  });

  it.each([true, false])("can accept or decline Support (%s)", (accept: boolean) => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [nickWildeToyDriveOfficer, cheapCharacterA], deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().quest(nickWildeToyDriveOfficer)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(nickWildeToyDriveOfficer, {
        resolveOptional: accept,
        ...(accept ? { targets: [cheapCharacterA] } : {}),
      }),
    ).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(1);
    expect(game.asPlayerOne().getCardStrength(cheapCharacterA)).toBe(accept ? 3 : 1);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardStrength(cheapCharacterA)).toBe(1);
  });
});
