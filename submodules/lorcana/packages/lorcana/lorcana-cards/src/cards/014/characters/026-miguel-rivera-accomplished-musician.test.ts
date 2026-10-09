import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { miguelRiveraAccomplishedMusician } from "./026-miguel-rivera-accomplished-musician";

const shiftBase = createMockCharacter({
  id: "miguel-am-shift-base",
  name: "Miguel Rivera",
  version: "Shift Base",
  cost: 5,
  strength: 4,
  willpower: 5,
});

const discardedCharacter = createMockCharacter({
  id: "miguel-am-discarded",
  name: "Discarded Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Miguel Rivera - Accomplished Musician", () => {
  it("requires exactly one character return and preserves the choice after empty or multiple targets", () => {
    const second = createMockCharacter({
      id: "miguel-second-return",
      name: "Second Return",
      cost: 1,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [miguelRiveraAccomplishedMusician],
      discard: [discardedCharacter, second],
      inkwell: 5,
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(miguelRiveraAccomplishedMusician)).toBeSuccessfulCommand();
    for (const targets of [[], [discardedCharacter, second]]) {
      expect(
        game.asPlayerOne().resolvePendingByCard(miguelRiveraAccomplishedMusician, { targets }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(discardedCharacter)).toBe("discard");
      expect(game.asPlayerOne().getCardZone(second)).toBe("discard");
      expect(game.asPlayerOne().getBagCount()).toBe(1);
    }
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(miguelRiveraAccomplishedMusician, { targets: [second] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(second)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(discardedCharacter)).toBe("discard");
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("Player Two owns the Shift return and inherits base damage and exertion", () => {
    const opposingDiscard = createMockCharacter({
      id: "miguel-other-discard",
      name: "Other Discard",
      cost: 1,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: [opposingDiscard], deck: 6 },
      {
        hand: [miguelRiveraAccomplishedMusician],
        play: [{ card: shiftBase, damage: 2 }],
        discard: [discardedCharacter],
        inkwell: 3,
        deck: 6,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(shiftBase)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(miguelRiveraAccomplishedMusician, {
        cost: {
          cost: "shift",
          shiftTarget: game.findCardInstanceId(shiftBase, "play", PLAYER_TWO),
        },
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getDamage(miguelRiveraAccomplishedMusician)).toBe(2);
    expect(game.asPlayerTwo().isExerted(miguelRiveraAccomplishedMusician)).toBe(true);
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(miguelRiveraAccomplishedMusician, { targets: [discardedCharacter] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(miguelRiveraAccomplishedMusician, { targets: [opposingDiscard] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(miguelRiveraAccomplishedMusician, { targets: [discardedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(discardedCharacter)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(opposingDiscard)).toBe("discard");
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
  });
  it("returns a character card from your discard to your hand when played via Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: shiftBase, isDrying: false }],
      hand: [miguelRiveraAccomplishedMusician],
      inkwell: 3,
      discard: [discardedCharacter],
      deck: 6,
    });

    const shiftTargetId = testEngine.findCardInstanceId(shiftBase, "play");
    expect(
      testEngine.asPlayerOne().playCard(miguelRiveraAccomplishedMusician, {
        cost: { cost: "shift", shiftTarget: shiftTargetId },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(miguelRiveraAccomplishedMusician, {
        targets: [discardedCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardedCharacter)).toBe("hand");
  });

  it("returns a character card from your discard to your hand when played normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [miguelRiveraAccomplishedMusician],
      inkwell: miguelRiveraAccomplishedMusician.cost,
      discard: [discardedCharacter],
      deck: 6,
    });

    expect(
      testEngine.asPlayerOne().playCard(miguelRiveraAccomplishedMusician),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(miguelRiveraAccomplishedMusician, {
        targets: [discardedCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardedCharacter)).toBe("hand");
  });
  it("returns only your discarded character, rejecting other zones, card types and owners", () => {
    const action = createMockAction({
      id: "miguel-discard-action",
      name: "Discard Action",
      cost: 1,
      text: "An action.",
    });
    const opposing = createMockCharacter({
      id: "miguel-opponent-discard",
      name: "Opponent Character",
      cost: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [miguelRiveraAccomplishedMusician],
        play: [shiftBase],
        discard: [discardedCharacter, action],
        inkwell: miguelRiveraAccomplishedMusician.cost,
        deck: 6,
      },
      { discard: [opposing], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(miguelRiveraAccomplishedMusician)).toBeSuccessfulCommand();
    for (const target of [shiftBase, action, opposing]) {
      expect(
        engine
          .asPlayerOne()
          .resolvePendingByCard(miguelRiveraAccomplishedMusician, { targets: [target] }),
      ).not.toBeSuccessfulCommand();
    }
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(miguelRiveraAccomplishedMusician, { targets: [discardedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(discardedCharacter)).toBe("hand");
  });

  it("finishes without a choice when your discard has no character", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [miguelRiveraAccomplishedMusician],
      inkwell: miguelRiveraAccomplishedMusician.cost,
      deck: 6,
    });
    expect(engine.asPlayerOne().playCard(miguelRiveraAccomplishedMusician)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("keeps a fresh Shift base drying while resolving the mandatory return", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: shiftBase, isDrying: true, damage: 1 }],
      hand: [miguelRiveraAccomplishedMusician],
      discard: [discardedCharacter],
      inkwell: 3,
      deck: 6,
    });
    expect(
      game.asPlayerOne().playCard(miguelRiveraAccomplishedMusician, {
        cost: { cost: "shift", shiftTarget: game.findCardInstanceId(shiftBase, "play") },
      }),
    ).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(miguelRiveraAccomplishedMusician, { targets: [discardedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(miguelRiveraAccomplishedMusician)).toBe(1);
    expect(game.asPlayerOne().isExerted(miguelRiveraAccomplishedMusician)).toBe(false);
    expect(game.asPlayerOne().quest(miguelRiveraAccomplishedMusician)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(miguelRiveraAccomplishedMusician)).toBe(false);
    expect(game.asPlayerOne().getCardZone(discardedCharacter)).toBe("hand");
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("finishes with only non-character cards in your discard", () => {
    const action = createMockAction({
      id: "miguel-no-character-action",
      name: "Non Character",
      cost: 1,
      text: "Action.",
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [miguelRiveraAccomplishedMusician], discard: [action], inkwell: 5, deck: 6 },
      { discard: [discardedCharacter], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(miguelRiveraAccomplishedMusician)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(action)).toBe("discard");
    expect(game.asPlayerTwo().getCardZone(discardedCharacter)).toBe("discard");
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("requires three ink and a matching name for Shift", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [shiftBase],
      hand: [miguelRiveraAccomplishedMusician],
      inkwell: 2,
      deck: 6,
    });
    expect(
      engine.asPlayerOne().playCard(miguelRiveraAccomplishedMusician, {
        cost: { cost: "shift", shiftTarget: engine.findCardInstanceId(shiftBase, "play") },
      }),
    ).not.toBeSuccessfulCommand();
    const wrongName = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [discardedCharacter],
      hand: [miguelRiveraAccomplishedMusician],
      inkwell: 3,
      deck: 6,
    });
    expect(
      wrongName.asPlayerOne().playCard(miguelRiveraAccomplishedMusician, {
        cost: {
          cost: "shift",
          shiftTarget: wrongName.findCardInstanceId(discardedCharacter, "play"),
        },
      }),
    ).not.toBeSuccessfulCommand();
  });
});
