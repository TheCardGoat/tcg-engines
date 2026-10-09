import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { nickWildeProvidingBackup } from "./025-nick-wilde-providing-backup";

const fellowDetective = createMockCharacter({
  id: "nick-pb-fellow-detective",
  name: "Fellow Detective",
  cost: 2,
  classifications: ["Storyborn", "Detective"],
});

const nonDetective = createMockCharacter({
  id: "nick-pb-non-detective",
  name: "Non Detective",
  cost: 2,
  classifications: ["Storyborn", "Ally"],
});

const supportTarget = createMockCharacter({
  id: "nick-pb-support-target",
  name: "Support Target",
  cost: 2,
  strength: 1,
  willpower: 4,
});

describe("Nick Wilde - Providing Backup", () => {
  it("gains Support immediately when a fresh Detective is played", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [nickWildeProvidingBackup, supportTarget],
      hand: [fellowDetective],
      inkwell: 2,
      deck: 6,
    });
    expect(game.hasKeyword(nickWildeProvidingBackup, "Support")).toBe(false);
    expect(game.asPlayerOne().playCard(fellowDetective)).toBeSuccessfulCommand();
    expect(game.hasKeyword(nickWildeProvidingBackup, "Support")).toBe(true);
    expect(game.asPlayerOne().quest(nickWildeProvidingBackup)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(
      game.asPlayerOne().resolvePendingByCard(nickWildeProvidingBackup, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(4);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });

  it("Player Two owns Support and may give the current boosted strength to an opponent", () => {
    const boost = createMockAction({
      id: "backup-boost",
      name: "Boost",
      cost: 1,
      text: "Give a character +2 strength this turn.",
      abilities: [
        {
          type: "action",
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [supportTarget], deck: 6 },
      {
        play: [nickWildeProvidingBackup, { card: fellowDetective, exerted: true }],
        hand: [boost],
        inkwell: 1,
        deck: 6,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(boost, { targets: [nickWildeProvidingBackup] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardStrength(nickWildeProvidingBackup)).toBe(5);
    expect(game.asPlayerTwo().quest(nickWildeProvidingBackup)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(1);
    expect(
      game.asPlayerOne().resolvePendingByCard(nickWildeProvidingBackup, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(1);
    expect(
      game.asPlayerTwo().resolvePendingByCard(nickWildeProvidingBackup, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(6);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(supportTarget)).toBe(1);
    expect(game.asPlayerTwo().getCardStrength(nickWildeProvidingBackup)).toBe(3);
    expect(game.asPlayerOne().hasGameEnded()).toBe(false);
  });
  it("gains Support while you have another Detective character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: nickWildeProvidingBackup, isDrying: false }, fellowDetective, supportTarget],
      deck: 6,
    });

    expect(testEngine.hasKeyword(nickWildeProvidingBackup, "Support")).toBe(true);

    expect(testEngine.asPlayerOne().quest(nickWildeProvidingBackup)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(nickWildeProvidingBackup, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      (supportTarget.strength ?? 0) + (nickWildeProvidingBackup.strength ?? 0),
    );
  });

  it("does not gain Support without another Detective character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: nickWildeProvidingBackup, isDrying: false }, nonDetective],
      deck: 6,
    });

    expect(testEngine.hasKeyword(nickWildeProvidingBackup, "Support")).toBe(false);

    // A normal quest adds lore and queues no Support resolution.
    expect(testEngine.asPlayerOne().quest(nickWildeProvidingBackup)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("another copy is a Detective and can receive Support, while the source cannot", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [nickWildeProvidingBackup, nickWildeProvidingBackup],
      deck: 6,
    });
    const ids = game.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(ids).toHaveLength(2);
    const [source, target] = ids;
    expect(game.hasKeyword(source, "Support")).toBe(true);
    expect(game.hasKeyword(target, "Support")).toBe(true);
    expect(game.asPlayerOne().quest(source)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true, targets: [source] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    expect(
      game.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(source)).toBe(3);
    expect(game.asPlayerOne().getCardStrength(target)).toBe(6);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("does not gain Support when he is the only Detective", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: nickWildeProvidingBackup, isDrying: false }],
      deck: 6,
    });

    expect(testEngine.hasKeyword(nickWildeProvidingBackup, "Support")).toBe(false);
  });
  it("does not count an opponent's Detective", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [nickWildeProvidingBackup], deck: 6 },
      { play: [fellowDetective], deck: 6 },
    );
    expect(engine.asPlayerOne().quest(nickWildeProvidingBackup)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("can decline Support without changing strength", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [nickWildeProvidingBackup, fellowDetective, supportTarget],
      deck: 6,
    });
    expect(engine.asPlayerOne().quest(nickWildeProvidingBackup)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(nickWildeProvidingBackup, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });

  it("can support an opposing character, cannot support himself, and the bonus expires", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [nickWildeProvidingBackup, fellowDetective], deck: 6 },
      { play: [supportTarget], deck: 6 },
    );
    expect(engine.asPlayerOne().quest(nickWildeProvidingBackup)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(nickWildeProvidingBackup, {
        resolveOptional: true,
        targets: [nickWildeProvidingBackup],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(nickWildeProvidingBackup, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardStrength(supportTarget)).toBe(
      (supportTarget.strength ?? 0) + nickWildeProvidingBackup.strength,
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });

  it("loses Support immediately when the last other Detective leaves play", () => {
    const banish = createMockAction({
      id: "nick-remove-detective",
      name: "Remove Detective",
      cost: 1,
      text: "Banish a character.",
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [nickWildeProvidingBackup, fellowDetective],
      hand: [banish],
      inkwell: 1,
      deck: 6,
    });
    expect(engine.hasKeyword(nickWildeProvidingBackup, "Support")).toBe(true);
    expect(
      engine.asPlayerOne().playCard(banish, { targets: [fellowDetective] }),
    ).toBeSuccessfulCommand();
    expect(engine.hasKeyword(nickWildeProvidingBackup, "Support")).toBe(false);
    expect(engine.asPlayerOne().quest(nickWildeProvidingBackup)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
  });
});
