import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseBestInTown } from "./023-mickey-mouse-best-in-town";

const opposingCharacter = createMockCharacter({
  id: "mickey-bit-opposing",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Mickey Mouse - Best in Town", () => {
  it("Player Two must quest and gives both players one additional drop only at their own end", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6, inkDrops: 2 },
      { play: [mickeyMouseBestInTown], deck: 6, inkDrops: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(game.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(mickeyMouseBestInTown)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().hasGameEnded()).toBe(false);
  });

  it("each exerted copy gives a drop and the opponent can spend a gained drop", () => {
    const purchase = createMockCharacter({ id: "mickey-drop-purchase", name: "Purchase", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: mickeyMouseBestInTown, exerted: true },
          { card: mickeyMouseBestInTown, exerted: true },
        ],
        deck: 6,
      },
      { hand: [purchase], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(2);
    expect(
      game.asPlayerOne().resolveBag(game.asPlayerOne().getBagEffects()[0]!.id, {}),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(purchase)).toBe("play");
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("a freshly paid Mickey cannot quest and gives no drop while ready", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mickeyMouseBestInTown], inkwell: 1, deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(mickeyMouseBestInTown)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(mickeyMouseBestInTown)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(mickeyMouseBestInTown)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
  it("cannot challenge (Adventurous)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mickeyMouseBestInTown, isDrying: false }],
        deck: 6,
      },
      {
        play: [{ card: opposingCharacter, exerted: true }],
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(mickeyMouseBestInTown, opposingCharacter),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseBestInTown)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(opposingCharacter)).toBe("play");
  });

  it("gives each player 1 ink drop at end of turn while exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mickeyMouseBestInTown, exerted: true }],
        deck: 6,
      },
      { deck: 6 },
    );

    const p1Before = testEngine.getInkDrops(PLAYER_ONE);
    const p2Before = testEngine.getInkDrops(PLAYER_TWO);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(p1Before + 1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(p2Before + 1);
  });

  it("gives no ink drops at end of turn while ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mickeyMouseBestInTown, isDrying: true }],
        deck: 6,
      },
      { deck: 6 },
    );

    const p1Before = testEngine.getInkDrops(PLAYER_ONE);
    const p2Before = testEngine.getInkDrops(PLAYER_TWO);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(p1Before);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(p2Before);
  });
  it("must quest before ending the turn if ready and able", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mickeyMouseBestInTown, isDrying: false }],
        deck: 6,
      },
      { deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(mickeyMouseBestInTown)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(mickeyMouseBestInTown.lore);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("does not gain more ink drops at the end of the opponent's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mickeyMouseBestInTown, exerted: true }],
        deck: 6,
      },
      { deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
  });
  it("Player Two's exact exerted copies reward independently and do not trigger on the opposing turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: mickeyMouseBestInTown, isDrying: true }], deck: 6 },
      {
        play: [mickeyMouseBestInTown, mickeyMouseBestInTown],
        hand: [mickeyMouseBestInTown],
        inkwell: 1,
        deck: 6,
      },
    );
    const ownMickeys = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const freshMickey = game.getCardInstanceIdsInZone("hand", PLAYER_TWO)[0]!;
    const opposingMickey = game.getCardInstanceIdsInZone("play", PLAYER_ONE)[0]!;
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(ownMickeys[0]!)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(ownMickeys[1]!)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(4);
    expect(game.asPlayerTwo().playCard(freshMickey)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(freshMickey)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(freshMickey)).toBe(false);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(2);
    expect(game.asPlayerTwo().resolvePendingByCard(ownMickeys[0]!)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerOne().quest(opposingMickey)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // Only the opposing source rewards here; the two exerted Player Two copies do not.
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
});
