import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseBestInTown } from "./023-mickey-mouse-best-in-town";
import { mickeyMouseBestInTownIconic } from "./241-mickey-mouse-best-in-town-iconic";

describe("Mickey Mouse - Best in Town (Iconic)", () => {
  it("normal inking creates no HOT DOG reward", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mickeyMouseBestInTownIconic], deck: 6 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.putIntoInkwell(PLAYER_ONE, mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(owner.getCardZone(mickeyMouseBestInTownIconic)).toBe("inkwell");
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(owner.getBagCount()).toBe(0);
    expect(owner.getPendingEffects()).toHaveLength(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("cannot quest with the opposing Mickey or satisfy its own mandatory quest", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { play: [{ card: mickeyMouseBestInTownIconic, isDrying: false }], deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.quest(mickeyMouseBestInTownIconic).success).toBe(false);
    expect(owner.isExerted(mickeyMouseBestInTownIconic)).toBe(false);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.getLore(PLAYER_TWO)).toBe(0);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn().success).toBe(false);
    expect(engine.asPlayerTwo().quest(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("each exerted iconic copy grants a spendable drop to each player", () => {
    const purchase = createMockCharacter({
      id: "iconic-mickey-purchase",
      name: "Purchase",
      cost: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: mickeyMouseBestInTownIconic, exerted: true },
          { card: mickeyMouseBestInTownIconic, exerted: true },
        ],
        deck: 6,
      },
      { hand: [purchase], deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(owner.getBagCount()).toBe(2);
    expect(owner.resolveBag(owner.getBagEffects()[0]!.id, {})).toBeSuccessfulCommand();
    expect(owner.getBagCount()).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(engine.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(purchase)).toBe("play");
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("a fresh iconic Mickey cannot quest and does not prevent ending its first turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mickeyMouseBestInTownIconic], inkwell: 1, deck: 6 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.playCard(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(owner.quest(mickeyMouseBestInTownIconic).success).toBe(false);
    expect(owner.isExerted(mickeyMouseBestInTownIconic)).toBe(false);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(owner.passTurn().success).toBe(false);
    expect(owner.quest(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("rejects play without ink and does not create a reward", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mickeyMouseBestInTownIconic], deck: 6 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.playCard(mickeyMouseBestInTownIconic).success).toBe(false);
    expect(owner.getCardZone(mickeyMouseBestInTownIconic)).toBe("hand");
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("gives both players a drop when Player Two quests and ends their turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6, inkDrops: 2 },
      { play: [{ card: mickeyMouseBestInTownIconic, isDrying: false }], deck: 6, inkDrops: 3 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(3);
    const player = engine.asPlayerTwo();
    expect(player.passTurn().success).toBe(false);
    expect(player.quest(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(4);
    expect(player.hasGameEnded()).toBe(false);
  });

  it("does not give drops at the end of the opponent's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: mickeyMouseBestInTownIconic, exerted: true }], deck: 6 },
      { deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.asPlayerOne().isExerted(mickeyMouseBestInTownIconic)).toBe(false);
    expect(engine.asPlayerOne().hasGameEnded()).toBe(false);
  });

  it("cannot challenge and must quest before passing when able", () => {
    const defender = createMockCharacter({
      id: "iconic-mickey-defender",
      name: "Defender",
      cost: 2,
      strength: 2,
      willpower: 4,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: mickeyMouseBestInTownIconic, isDrying: false }], deck: 6 },
      { play: [{ card: defender, exerted: true }], deck: 6 },
    );
    const player = engine.asPlayerOne();
    expect(player.challenge(mickeyMouseBestInTownIconic, defender).success).toBe(false);
    expect(player.isExerted(mickeyMouseBestInTownIconic)).toBe(false);
    expect(player.getCard(defender)?.damage ?? 0).toBe(0);
    expect(player.passTurn().success).toBe(false);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(player.quest(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(player.isExerted(mickeyMouseBestInTownIconic)).toBe(true);
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(player.hasGameEnded()).toBe(false);
  });

  it("copies the base card's abilities verbatim (variant rule G-07)", () => {
    expect(mickeyMouseBestInTownIconic.abilities).toEqual(mickeyMouseBestInTown.abilities);
  });

  it("is playable from hand for its printed cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseBestInTownIconic],
      inkwell: mickeyMouseBestInTownIconic.cost,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseBestInTownIconic)).toBe("play");
  });

  it("at the end of your turn, an exerted Mickey gives each player 1 ink drop (HOT DOG!)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mickeyMouseBestInTownIconic],
        inkwell: mickeyMouseBestInTownIconic.cost,
        deck: 6,
      },
      { deck: 6 },
    );

    expect(testEngine.asPlayerOne().playCard(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasGameEnded()).toBe(false);
    // Quest to exert Mickey (Adventurous requires questing when able anyway),
    // then end the turn so HOT DOG! resolves.
    expect(testEngine.asPlayerOne().quest(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("a ready Mickey grants no ink drops at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mickeyMouseBestInTownIconic],
        inkwell: mickeyMouseBestInTownIconic.cost,
        deck: 1,
      },
      { deck: 1 },
    );

    expect(testEngine.asPlayerOne().playCard(mickeyMouseBestInTownIconic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });
});
