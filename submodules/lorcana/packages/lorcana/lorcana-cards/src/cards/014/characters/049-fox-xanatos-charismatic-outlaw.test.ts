import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { foxXanatosCharismaticOutlaw } from "./049-fox-xanatos-charismatic-outlaw";

const dockWorker = createMockCharacter({
  id: "fox-test-dock-worker",
  name: "Dock Worker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Fox Xanatos - Charismatic Outlaw", () => {
  it("has Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [foxXanatosCharismaticOutlaw],
      deck: 2,
    });

    expect(testEngine.hasKeyword(foxXanatosCharismaticOutlaw, "Rush")).toBe(true);
  });

  it("can challenge the same turn he is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [foxXanatosCharismaticOutlaw],
        inkwell: foxXanatosCharismaticOutlaw.cost,
        deck: 2,
      },
      {
        play: [{ card: dockWorker, exerted: true }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(foxXanatosCharismaticOutlaw)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().challenge(foxXanatosCharismaticOutlaw, dockWorker),
    ).toBeSuccessfulCommand();

    // 5 {S} vs 3 {W}: the defender is banished; Fox takes 2 and survives on 6 {W}.
    expect(testEngine.asPlayerTwo().getCardZone(dockWorker)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(foxXanatosCharismaticOutlaw)).toBe("play");
    expect(testEngine.asPlayerOne().getCard(foxXanatosCharismaticOutlaw).damage).toBe(2);
    expect(testEngine.isExerted(foxXanatosCharismaticOutlaw)).toBe(true);
  });
  it("Rush does not allow questing or singing on the play turn", () => {
    const song = createMockSong({
      id: "fox-rush-song",
      name: "Song",
      cost: 1,
      text: "Draw a card.",
      abilities: [{ type: "action", effect: { type: "draw", amount: 1, target: "CONTROLLER" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [foxXanatosCharismaticOutlaw, song],
      inkwell: foxXanatosCharismaticOutlaw.cost,
      deck: 2,
    });
    expect(engine.asPlayerOne().playCard(foxXanatosCharismaticOutlaw)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(foxXanatosCharismaticOutlaw)).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().singSong(song, foxXanatosCharismaticOutlaw),
    ).not.toBeSuccessfulCommand();
    expect(engine.isExerted(foxXanatosCharismaticOutlaw)).toBe(false);
    expect(engine.asPlayerOne().getCardZone(song)).toBe("hand");
  });

  it("allows player two to challenge immediately and quest after its next ready step", () => {
    const defender = createMockCharacter({
      id: "fox-p2-defender",
      name: "Defender",
      cost: 1,
      strength: 2,
      willpower: 7,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [defender], deck: 6 },
      { hand: [foxXanatosCharismaticOutlaw], inkwell: 5, deck: 6 },
    );
    expect(engine.asPlayerOne().quest(defender)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(foxXanatosCharismaticOutlaw)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().quest(foxXanatosCharismaticOutlaw)).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().challenge(foxXanatosCharismaticOutlaw, defender),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(defender).damage).toBe(5);
    expect(engine.asPlayerTwo().getCard(foxXanatosCharismaticOutlaw).damage).toBe(2);
    expect(engine.isExerted(foxXanatosCharismaticOutlaw)).toBe(true);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.isExerted(foxXanatosCharismaticOutlaw)).toBe(false);
    expect(engine.asPlayerTwo().quest(foxXanatosCharismaticOutlaw)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(1);
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("Rush does not allow challenging a ready opposing character", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [foxXanatosCharismaticOutlaw], inkwell: foxXanatosCharismaticOutlaw.cost, deck: [] },
      { play: [dockWorker], deck: [] },
    );
    expect(engine.asPlayerOne().playCard(foxXanatosCharismaticOutlaw)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().challenge(foxXanatosCharismaticOutlaw, dockWorker),
    ).not.toBeSuccessfulCommand();
    expect(engine.isExerted(foxXanatosCharismaticOutlaw)).toBe(false);
  });
});

it("Player Two Rush does not bypass singing or ready-target restrictions", () => {
  const song = createMockSong({
    id: "fox-p2-rush-song",
    name: "Song",
    cost: 3,
    text: "Draw a card.",
    abilities: [{ type: "action", effect: { type: "draw", amount: 1, target: "CONTROLLER" } }],
  });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [dockWorker], deck: 6 },
    { hand: [foxXanatosCharismaticOutlaw, song], inkwell: 5, deck: 6 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().playCard(foxXanatosCharismaticOutlaw)).toBeSuccessfulCommand();
  expect(
    engine.asPlayerTwo().singSong(song, foxXanatosCharismaticOutlaw),
  ).not.toBeSuccessfulCommand();
  expect(
    engine.asPlayerTwo().challenge(foxXanatosCharismaticOutlaw, dockWorker),
  ).not.toBeSuccessfulCommand();
  expect(engine.isExerted(foxXanatosCharismaticOutlaw)).toBe(false);
  expect(engine.asPlayerTwo().getCardZone(song)).toBe("hand");
  expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().singSong(song, foxXanatosCharismaticOutlaw)).toBeSuccessfulCommand();
  expect(engine.isExerted(foxXanatosCharismaticOutlaw)).toBe(true);
  expect(engine.asPlayerTwo().getCardZone(song)).toBe("discard");
});
