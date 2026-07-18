// Rules grounding: CR 2.2.0 5.1.1.7, 8.10.4.2, 8.10.6-8.10.8.3.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseMinnieMouseAdventuringDuo } from "./099-mickey-mouse-minnie-mouse-adventuring-duo";

const mickeyBase = createMockCharacter({
  id: "mickey-minnie-adventuring-duo-mickey-base",
  name: "Mickey Mouse",
  cost: 2,
});

const minnieBase = createMockCharacter({
  id: "mickey-minnie-adventuring-duo-minnie-base",
  name: "Minnie Mouse",
  cost: 2,
});

const banishChosenCharacter = createMockAction({
  id: "mickey-minnie-adventuring-duo-banish-action",
  name: "Banish Chosen Character",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          cardTypes: ["character"],
          zones: ["play"],
        },
      },
    },
  ],
});

describe("Mickey Mouse & Minnie Mouse - Adventuring Duo", () => {
  it("duo shifts onto one Mickey Mouse and one Minnie Mouse", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseMinnieMouseAdventuringDuo],
      play: [mickeyBase, minnieBase],
      inkwell: 0,
    });
    const mickeyTarget = testEngine.findCardInstanceId(mickeyBase, "play", PLAYER_ONE);
    const minnieTarget = testEngine.findCardInstanceId(minnieBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(mickeyMouseMinnieMouseAdventuringDuo, {
        cost: {
          cost: "shift",
          shiftTarget: mickeyTarget,
          additionalShiftTargets: [minnieTarget],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseMinnieMouseAdventuringDuo)).toBe("play");
    expect(testEngine.getCardsUnder(mickeyMouseMinnieMouseAdventuringDuo)).toHaveLength(2);
  });

  it("surfaces both Duo Shift targets as selectable shift options", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseMinnieMouseAdventuringDuo],
      play: [mickeyBase, minnieBase],
      inkwell: 0,
    });
    const player = testEngine.asPlayerOne();
    const duoCardId = testEngine.findCardInstanceId(
      mickeyMouseMinnieMouseAdventuringDuo,
      "hand",
      PLAYER_ONE,
    );
    const mickeyTarget = testEngine.findCardInstanceId(mickeyBase, "play", PLAYER_ONE);
    const minnieTarget = testEngine.findCardInstanceId(minnieBase, "play", PLAYER_ONE);

    expect(player.getShiftPlayDisabledReason(duoCardId)).toBeNull();
    expect(
      player.getAvailableMoves().find((move) => move.moveId === "shiftCard")?.selectableCardIds,
    ).toContain(duoCardId);
    expect(player.getMoveOptions("shiftCard", duoCardId)).toEqual(
      expect.arrayContaining([
        { kind: "card", cardId: mickeyTarget },
        { kind: "card", cardId: minnieTarget },
      ]),
    );
  });

  it("is drying when either Duo Shift target is drying", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseMinnieMouseAdventuringDuo],
      play: [
        { card: mickeyBase, isDrying: false },
        { card: minnieBase, isDrying: true },
      ],
      inkwell: 0,
    });
    const mickeyTarget = testEngine.findCardInstanceId(mickeyBase, "play", PLAYER_ONE);
    const minnieTarget = testEngine.findCardInstanceId(minnieBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(mickeyMouseMinnieMouseAdventuringDuo, {
        cost: {
          cost: "shift",
          shiftTarget: mickeyTarget,
          additionalShiftTargets: [minnieTarget],
        },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(mickeyMouseMinnieMouseAdventuringDuo).success).toBe(
      false,
    );
  });

  it("retains the damage from both Duo Shift targets", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseMinnieMouseAdventuringDuo],
      play: [
        { card: mickeyBase, damage: 1 },
        { card: minnieBase, damage: 2 },
      ],
      inkwell: 0,
    });
    const mickeyTarget = testEngine.findCardInstanceId(mickeyBase, "play", PLAYER_ONE);
    const minnieTarget = testEngine.findCardInstanceId(minnieBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(mickeyMouseMinnieMouseAdventuringDuo, {
        cost: {
          cost: "shift",
          shiftTarget: mickeyTarget,
          additionalShiftTargets: [minnieTarget],
        },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asServer().getCard(mickeyMouseMinnieMouseAdventuringDuo).damage).toBe(3);
  });

  it("goes to the inkwell facedown and exerted instead when banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banishChosenCharacter],
      play: [mickeyMouseMinnieMouseAdventuringDuo],
      inkwell: banishChosenCharacter.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(banishChosenCharacter, {
        targets: [mickeyMouseMinnieMouseAdventuringDuo],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseMinnieMouseAdventuringDuo)).toBe(
      "inkwell",
    );
    expect(
      testEngine.getCardPublicFaceState(
        mickeyMouseMinnieMouseAdventuringDuo,
        "inkwell",
        PLAYER_ONE,
      ),
    ).toBe("faceDown");
    expect(testEngine.asPlayerOne().isExerted(mickeyMouseMinnieMouseAdventuringDuo)).toBe(true);
  });

  it("puts the entire shifted stack into the inkwell when banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseMinnieMouseAdventuringDuo, banishChosenCharacter],
      play: [mickeyBase, minnieBase],
      inkwell: banishChosenCharacter.cost,
    });
    const mickeyTarget = testEngine.findCardInstanceId(mickeyBase, "play", PLAYER_ONE);
    const minnieTarget = testEngine.findCardInstanceId(minnieBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(mickeyMouseMinnieMouseAdventuringDuo, {
        cost: {
          cost: "shift",
          shiftTarget: mickeyTarget,
          additionalShiftTargets: [minnieTarget],
        },
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCard(banishChosenCharacter, {
        targets: [mickeyMouseMinnieMouseAdventuringDuo],
      }),
    ).toBeSuccessfulCommand();

    for (const card of [mickeyMouseMinnieMouseAdventuringDuo, mickeyBase, minnieBase]) {
      expect(testEngine.asPlayerOne().getCardZone(card)).toBe("inkwell");
      expect(testEngine.getCardPublicFaceState(card, "inkwell", PLAYER_ONE)).toBe("faceDown");
      expect(testEngine.asPlayerOne().isExerted(card)).toBe(true);
    }
  });
});
