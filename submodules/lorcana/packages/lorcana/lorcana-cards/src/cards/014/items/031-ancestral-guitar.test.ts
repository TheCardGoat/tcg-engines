// Rules grounding: Ancestral Guitar (set14-031).
// Musical Legacy: on-play draw. From the Heart: {E}, 1 {I} — chosen character
// gains Singer and counts as +2 cost to sing songs this turn.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { ancestralGuitar } from "./031-ancestral-guitar";

const deckCard = createMockCharacter({
  id: "guitar-deck-filler",
  name: "Deck Filler",
  cost: 2,
});

const singerCandidate = createMockCharacter({
  id: "guitar-singer-candidate",
  name: "Singer Candidate",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const expensiveSong = createMockSong({
  id: "guitar-expensive-song",
  name: "Grand Ballad",
  cost: 5,
  text: "A test song.",
});

describe("Ancestral Guitar", () => {
  it("Musical Legacy — when you play this item, draw a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ancestralGuitar],
      deck: [deckCard],
      inkwell: ancestralGuitar.cost,
    });

    expect(testEngine.asPlayerOne().playCard(ancestralGuitar)).toBeSuccessfulCommand();

    // Played from hand (-1), drew 1 (+1) → hand still has 1 card and the deck
    // is empty because the top card was drawn.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("hand");
  });

  it("From the Heart — chosen character counts as +2 cost to sing songs this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [expensiveSong],
      deck: 6,
      inkwell: 1,
      play: [ancestralGuitar, { card: singerCandidate, isDrying: false }],
    });

    // Without the boost, a cost-3 character with no Singer cannot sing a
    // cost-5 song.
    expect(testEngine.asPlayerOne().singSong(expensiveSong, singerCandidate).success).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [singerCandidate],
      }),
    ).toBeSuccessfulCommand();

    // Gains Singer and counts as cost 3 + 2 = 5, so the cost-5 song is legal.
    expect(
      testEngine.asPlayerOne().singSong(expensiveSong, singerCandidate),
    ).toBeSuccessfulCommand();
  });

  it("From the Heart — the +2 boost expires after the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [expensiveSong],
      deck: 6,
      inkwell: 1,
      play: [ancestralGuitar, { card: singerCandidate, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [singerCandidate],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(singerCandidate, "Singer")).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(singerCandidate, "Singer")).toBe(false);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Next turn: the temporary Singer/+2 boost is gone.
    expect(testEngine.asPlayerOne().singSong(expensiveSong, singerCandidate).success).toBe(false);
  });

  it("negative — From the Heart requires 1 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [expensiveSong],
      play: [ancestralGuitar, { card: singerCandidate, isDrying: false }],
    });

    const result = testEngine.asPlayerOne().activateAbility(ancestralGuitar, {
      ability: "From the Heart",
      targets: [singerCandidate],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(ancestralGuitar)).toBe(false);
    expect(testEngine.asPlayerOne().singSong(expensiveSong, singerCandidate).success).toBe(false);
  });
});

describe("Ancestral Guitar limits", () => {
  it("grants Singer, pays ink, exerts the item and cannot target an item", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ancestralGuitar, { card: singerCandidate, isDrying: false }],
      inkwell: 2,
    });
    expect(
      engine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [ancestralGuitar],
      }),
    ).not.toBeSuccessfulCommand();
    expect(engine.isExerted(ancestralGuitar)).toBe(false);
    expect(
      engine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [singerCandidate],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.hasKeyword(singerCandidate, "Singer")).toBe(true);
    expect(engine.isExerted(ancestralGuitar)).toBe(true);
    expect(
      engine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [singerCandidate],
      }),
    ).not.toBeSuccessfulCommand();
  });

  it("can target an opposing character but the boost expires when its turn starts", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ancestralGuitar], inkwell: 1, deck: 5 },
      { play: [{ card: singerCandidate, isDrying: false }], hand: [expensiveSong], deck: 5 },
    );
    expect(
      engine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [singerCandidate],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.hasKeyword(singerCandidate, "Singer")).toBe(true);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.hasKeyword(singerCandidate, "Singer")).toBe(false);
    expect(
      engine.asPlayerTwo().singSong(expensiveSong, singerCandidate),
    ).not.toBeSuccessfulCommand();
  });

  it("does not remove drying restrictions", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ancestralGuitar, { card: singerCandidate, isDrying: true }],
      hand: [expensiveSong],
      deck: 6,
      inkwell: 1,
    });
    expect(
      engine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [singerCandidate],
      }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().singSong(expensiveSong, singerCandidate),
    ).not.toBeSuccessfulCommand();
  });

  it("raises printed cost, rather than adding two to an existing Singer value", () => {
    const existingSinger = createMockCharacter({
      id: "guitar-existing-singer",
      name: "Existing Singer",
      cost: 3,
      abilities: [{ type: "keyword", keyword: "Singer", value: 5 }],
    });
    const tooExpensive = createMockSong({
      id: "guitar-six",
      name: "Six",
      cost: 6,
      text: "A test song.",
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ancestralGuitar, { card: existingSinger, isDrying: false }],
      hand: [tooExpensive, expensiveSong],
      inkwell: 1,
    });
    expect(
      engine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [existingSinger],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().singSong(tooExpensive, existingSinger)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().singSong(expensiveSong, existingSinger)).toBeSuccessfulCommand();
  });
});

describe("Ancestral Guitar entry and player two", () => {
  it("player two pays two, draws exactly one and activates the newly played item for one", () => {
    const normalDraw = createMockCharacter({
      id: "guitar-normal-draw",
      name: "Normal Draw",
      cost: 1,
    });
    const filler = createMockCharacter({
      id: "guitar-private-filler",
      name: "Private Filler",
      cost: 1,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      {
        hand: [ancestralGuitar, expensiveSong],
        play: [singerCandidate],
        inkwell: 3,
        deck: [filler, filler, filler, filler, deckCard, normalDraw],
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(normalDraw)).toBe("hand");
    expect(game.asPlayerTwo().playCard(ancestralGuitar)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
    expect(game.asPlayerTwo().getCardZone(deckCard)).toBe("hand");
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(4);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(
      game.asPlayerTwo().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [singerCandidate],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().isExerted(ancestralGuitar)).toBe(true);
    expect(game.asPlayerTwo().singSong(expensiveSong, singerCandidate)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(singerCandidate)).toBe(true);
  });
  it("keeps the same target for the singing bonus when the player chooses after activation", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ancestralGuitar, singerCandidate],
      hand: [expensiveSong],
      inkwell: 1,
      deck: 6,
    });
    expect(
      game.asPlayerOne().activateAbility(ancestralGuitar, { ability: "From the Heart" }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolveNextPending({ targets: [singerCandidate] }),
    ).toBeSuccessfulCommand();
    expect(game.hasKeyword(singerCandidate, "Singer")).toBe(true);
    expect(
      game
        .asPlayerOne()
        .getAvailableMoves()
        .find((move) => move.moveId === "singCard")?.selectableCardIds,
    ).toContain(game.findCardInstanceId(expensiveSong, "hand"));
    expect(game.asPlayerOne().singSong(expensiveSong, singerCandidate)).toBeSuccessfulCommand();
  });
});

describe("Ancestral Guitar empty entry", () => {
  it("player two resolves Musical Legacy with an empty deck without creating a card or pending effect", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { hand: [ancestralGuitar], deck: [deckCard], inkwell: 2 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(deckCard)).toBe("hand");
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
    expect(game.asPlayerTwo().playCard(ancestralGuitar)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerTwo().getCardZone(ancestralGuitar)).toBe("play");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
});
