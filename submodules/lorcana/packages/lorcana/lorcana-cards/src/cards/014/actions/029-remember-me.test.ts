import { mickeyMouseTrueFriend, minnieMouseBelovedPrincess } from "../../001";
import { mickeyMouseMinnieMouseAdventuringDuo } from "../../013";
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { rememberMe } from "./029-remember-me";

const discardCharacter = createMockCharacter({
  id: "rm-discard",
  name: "Returned Friend",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Remember Me", () => {
  it("lets you play characters from your discard for the rest of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rememberMe],
        inkwell: rememberMe.cost + discardCharacter.cost,
        discard: [discardCharacter],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();

    // The permission is active: the discarded character is playable now.
    expect(testEngine.asPlayerOne().playCard(discardCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(discardCharacter)).toBe("play");

    expect(testEngine.asPlayerOne().isExerted(discardCharacter)).toBe(true);
    // Entered play exerted via the permission.
    expect(testEngine.asPlayerOne().quest(discardCharacter)).not.toBeSuccessfulCommand();
  });
});

describe("Remember Me (Sing Together)", () => {
  it("can be sung via Sing Together 6 with characters totaling cost 6+", () => {
    const singerA = createMockCharacter({ id: "rm-sing-a", name: "Singer A", cost: 4 });
    const singerB = createMockCharacter({ id: "rm-sing-b", name: "Singer B", cost: 2 });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rememberMe],
        inkwell: discardCharacter.cost,
        discard: [discardCharacter],
        play: [singerA, singerB],
      },
      {},
    );

    expect(
      testEngine.asPlayerOne().playSongTogether(rememberMe, [singerA, singerB]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(singerB)).toBe(true);
    // The song's permission resolves from the sing: characters in the discard
    // become playable this turn.
    expect(testEngine.asPlayerOne().playCard(discardCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(discardCharacter)).toBe("play");
  });
});

describe("Remember Me boundaries", () => {
  it("blocks the same name from hand after a discard play, then expires next turn", () => {
    const handTwin = createMockCharacter({
      id: "rm-hand-twin",
      name: discardCharacter.name,
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [rememberMe, handTwin], discard: [discardCharacter], inkwell: 10, deck: 5 },
      { deck: 5 },
    );
    expect(engine.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(discardCharacter)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(handTwin)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(handTwin)).toBe("hand");
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(handTwin)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(handTwin)).toBe(false);
  });

  it("does not grant free play or permission after the turn ends", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [rememberMe], discard: [discardCharacter], inkwell: 7, deck: 5 },
      { deck: 5 },
    );
    expect(engine.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(discardCharacter)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(discardCharacter)).toBe("discard");
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(discardCharacter)).not.toBeSuccessfulCommand();
  });

  it("does not grant permission to an opposing character", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [rememberMe], inkwell: 10 },
      { discard: [discardCharacter] },
    );
    expect(engine.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(discardCharacter)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(discardCharacter)).toBe("discard");
  });
});

describe("Remember Me (name uniqueness)", () => {
  const twinDiscardA = createMockCharacter({
    id: "rm-twin-a",
    name: "Twin Friend",
    cost: 2,
  });
  const twinDiscardB = createMockCharacter({
    id: "rm-twin-b",
    name: "Twin Friend",
    cost: 2,
  });
  const otherDiscard = createMockCharacter({
    id: "rm-other",
    name: "Other Friend",
    cost: 2,
  });

  it("refuses a same-named character after playing one via the permission", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rememberMe],
        inkwell: rememberMe.cost + 4,
        discard: [twinDiscardA, twinDiscardB, otherDiscard],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();

    // First Twin Friend plays fine.
    expect(testEngine.asPlayerOne().playCard(twinDiscardA)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(twinDiscardA)).toBe("play");

    // The second Twin Friend is refused by the name-uniqueness clause.
    expect(testEngine.asPlayerOne().playCard(twinDiscardB)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(twinDiscardB)).toBe("discard");

    // A different-named character is still playable.
    expect(testEngine.asPlayerOne().playCard(otherDiscard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(otherDiscard)).toBe("play");
  });

  it("treats the halves of an ampersand name as the same name (CR 5.2.6.1)", () => {
    const combinedDiscard = createMockCharacter({
      id: "rm-pair-combined",
      name: "Twin & Friend",
      cost: 2,
    });
    const halfDiscard = createMockCharacter({
      id: "rm-pair-half",
      name: "Twin",
      cost: 2,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rememberMe],
        inkwell: rememberMe.cost + 4,
        discard: [combinedDiscard, halfDiscard],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();

    // Playing the combined name records BOTH halves; the single-named half is
    // then refused, and the reverse order refuses the combined card too.
    expect(testEngine.asPlayerOne().playCard(combinedDiscard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(halfDiscard)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(halfDiscard)).toBe("discard");
  });

  it("refuses the combined name after playing one of its halves", () => {
    const combinedDiscard = createMockCharacter({
      id: "rm-pair-combined-2",
      name: "Twin & Friend",
      cost: 2,
    });
    const halfDiscard = createMockCharacter({
      id: "rm-pair-half-2",
      name: "Twin",
      cost: 2,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rememberMe],
        inkwell: rememberMe.cost + 4,
        discard: [combinedDiscard, halfDiscard],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(halfDiscard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(combinedDiscard)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(combinedDiscard)).toBe("discard");
  });
});

describe("Remember Me additional limits", () => {
  it("allows a prior hand play with the same name and excludes actions from discard", () => {
    const handTwin = createMockCharacter({
      id: "rm-prior-hand",
      name: discardCharacter.name,
      cost: 2,
    });
    const action = createMockAction({ id: "rm-action", name: "Discarded Action", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [rememberMe, handTwin], discard: [discardCharacter, action], inkwell: 11 },
      {},
    );
    expect(engine.asPlayerOne().playCard(handTwin)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(action)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(action)).toBe("discard");
    expect(engine.asPlayerOne().playCard(discardCharacter)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(discardCharacter)).toBe(true);
  });

  it("rejects Sing Together below six without exerting singers", () => {
    const singerA = createMockCharacter({ id: "rm-low-a", name: "Low A", cost: 3 });
    const singerB = createMockCharacter({ id: "rm-low-b", name: "Low B", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [rememberMe], play: [singerA, singerB] },
      {},
    );
    expect(
      engine.asPlayerOne().playSongTogether(rememberMe, [singerA, singerB]),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(rememberMe)).toBe("hand");
    expect(engine.asPlayerOne().isExerted(singerA)).toBe(false);
    expect(engine.asPlayerOne().isExerted(singerB)).toBe(false);
  });
});

describe("Remember Me ownership and repeated songs", () => {
  it("player two sings, pays for exerted discard entry and blocks only their same-name plays until turn end", () => {
    const twin = createMockCharacter({ id: "rm-p2-twin", name: discardCharacter.name, cost: 2 });
    const untouched = createMockCharacter({
      id: "rm-p2-untouched",
      name: "Unused Friend",
      cost: 1,
    });
    const singerA = createMockCharacter({ id: "rm-p2-a", name: "Singer A", cost: 4 });
    const singerB = createMockCharacter({ id: "rm-p2-b", name: "Singer B", cost: 2 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [twin], inkwell: 2, deck: 6 },
      {
        hand: [rememberMe, twin],
        discard: [discardCharacter, untouched],
        play: [singerA, singerB],
        inkwell: 4,
        deck: 6,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playSongTogether(rememberMe, [singerA, singerB]),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(4);
    expect(game.asPlayerTwo().playCard(discardCharacter)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().isExerted(discardCharacter)).toBe(true);
    const ownTwinId = game.findCardInstanceId(twin, "hand", PLAYER_TWO);
    expect(game.asPlayerTwo().playCard(ownTwinId)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().playCard(game.findCardInstanceId(twin, "hand", PLAYER_ONE)),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(untouched)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(untouched)).toBe("discard");
    expect(game.asPlayerTwo().playCard(ownTwinId)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(ownTwinId)).toBe(false);
  });

  it("a second Remember Me does not reset names already played from discard this turn", () => {
    const twin = createMockCharacter({
      id: "rm-repeat-twin",
      name: discardCharacter.name,
      cost: 2,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rememberMe, rememberMe, twin],
      discard: [discardCharacter],
      inkwell: 16,
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(discardCharacter)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(rememberMe)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().playCard(twin)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(twin)).toBe("hand");
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  });
});

it("Player Two's repeated song preserves both halves of a discard-played name without restricting Player One", () => {
  const pair = createMockCharacter({ id: "rm-p2-pair", name: "Twin & Friend", cost: 2 });
  const half = createMockCharacter({ id: "rm-p2-half", name: "Friend", cost: 2 });
  const a = createMockCharacter({ id: "rm-p2-six", name: "Six", cost: 6 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [half], inkwell: 2, deck: 6 },
    { hand: [rememberMe, rememberMe, half], play: [a], discard: [pair], inkwell: 10, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playSongTogether(rememberMe, [a])).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(pair)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(pair)).toBe(true);
  expect(game.asPlayerTwo().playCard(rememberMe)).toBeSuccessfulCommand();
  const ownHalf = game.findCardInstanceId(half, "hand", PLAYER_TWO);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().playCard(ownHalf)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().playCard(game.findCardInstanceId(half, "hand", PLAYER_ONE)),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(ownHalf)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(ownHalf)).toBe(false);
});

it("reports the name restriction for Duo Shift when Remember Me blocks a combined name", () => {
  const singer = createMockCharacter({ id: "rm-shift-singer", name: "Singer", cost: 6 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [rememberMe, mickeyMouseMinnieMouseAdventuringDuo, minnieMouseBelovedPrincess],
    play: [singer],
    discard: [mickeyMouseTrueFriend],
    inkwell: 20,
    deck: 6,
  });
  expect(game.asPlayerOne().playSongTogether(rememberMe, [singer])).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(mickeyMouseTrueFriend)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(minnieMouseBelovedPrincess)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(15);
  expect(
    game.asPlayerOne().getStandardPlayDisabledReason(mickeyMouseMinnieMouseAdventuringDuo)?.code,
  ).toBe("PLAYER_PLAY_RESTRICTED");
  expect(
    game.asPlayerOne().getShiftPlayDisabledReason(mickeyMouseMinnieMouseAdventuringDuo)?.code,
  ).toBe("PLAYER_PLAY_RESTRICTED");
  expect(game.asPlayerOne().getCardZone(mickeyMouseMinnieMouseAdventuringDuo)).toBe("hand");
});
