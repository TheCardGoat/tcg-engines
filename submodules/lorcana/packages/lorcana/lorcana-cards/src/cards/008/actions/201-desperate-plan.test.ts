import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseArtfulRogue, mickeyMouseDetective } from "../../001";
import { goofyKnightForADay } from "../../002";
import { mickeyMouseFriendlyFace } from "../../002/characters/013-mickey-mouse-friendly-face";
import { mickeyMouseTrumpeter } from "../../003/characters/182-mickey-mouse-trumpeter";
import { desperatePlan } from "./201-desperate-plan";

describe("Desperate Plan", () => {
  it("draws until you have 3 cards when your hand is empty", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [desperatePlan],
      inkwell: desperatePlan.cost,
      deck: [goofyKnightForADay, goofyKnightForADay, goofyKnightForADay],
    });

    expect(testEngine.asPlayerOne().playCard(desperatePlan)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3, deck: 0, discard: 1 });
  });

  it("logs the draw-until branch as three drawn cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [desperatePlan],
      inkwell: desperatePlan.cost,
      deck: [goofyKnightForADay, mickeyMouseTrumpeter, mickeyMouseFriendlyFace],
    });

    expect(testEngine.asPlayerOne().playCard(desperatePlan)).toBeSuccessfulCommand();

    const playLog = testEngine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "playCard");

    expect(playLog).toMatchObject({
      moveType: "playCard",
      public: expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.outcome.cardsDrawn",
          values: expect.objectContaining({
            playerId: CANONICAL_PLAYER_ONE,
            amount: 3,
          }),
        }),
      ]),
      privateByPlayerId: {
        [CANONICAL_PLAYER_ONE]: expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.private.cardsDrawn.detail",
            values: expect.objectContaining({
              playerId: CANONICAL_PLAYER_ONE,
              cardIds: expect.any(Array),
            }),
          }),
        ]),
      },
    });
    expect(playLog?.public).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.outcome.cardsDiscarded.detail",
        }),
      ]),
    );
  });

  it("discards the chosen cards and draws that many", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [
        desperatePlan,
        mickeyMouseArtfulRogue,
        mickeyMouseDetective,
        goofyKnightForADay,
        mickeyMouseTrumpeter,
        mickeyMouseFriendlyFace,
      ],
      inkwell: desperatePlan.cost,
      deck: [goofyKnightForADay, goofyKnightForADay, goofyKnightForADay],
    });
    const playerOne = testEngine.asPlayerOne();
    expect(
      playerOne.playCard(desperatePlan, {
        targets: [mickeyMouseArtfulRogue, mickeyMouseDetective, goofyKnightForADay],
      }).success,
    ).toBe(true);

    expect(playerOne.getCardZone(mickeyMouseArtfulRogue)).toBe("discard");
    expect(playerOne.getCardZone(mickeyMouseDetective)).toBe("discard");
    expect(playerOne).toHaveZoneCounts({ hand: 5, deck: 0, discard: 4 });
  });

  it("logs the discard branch draw with private drawn-card detail", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [desperatePlan, mickeyMouseArtfulRogue, mickeyMouseDetective, mickeyMouseTrumpeter],
      inkwell: desperatePlan.cost,
      deck: [goofyKnightForADay, mickeyMouseFriendlyFace],
    });
    const artfulRogueId = testEngine.findCardInstanceId(mickeyMouseArtfulRogue, "hand", "p1");
    const detectiveId = testEngine.findCardInstanceId(mickeyMouseDetective, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(desperatePlan, {
        targets: [mickeyMouseArtfulRogue, mickeyMouseDetective],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseArtfulRogue)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseDetective)).toBe("discard");

    const playLog = testEngine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "playCard");

    expect(playLog).toMatchObject({
      moveType: "playCard",
      public: expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.outcome.cardsDrawn",
          values: expect.objectContaining({
            playerId: CANONICAL_PLAYER_ONE,
            amount: 2,
          }),
        }),
      ]),
      privateByPlayerId: {
        [CANONICAL_PLAYER_ONE]: expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.private.cardsDrawn.detail",
            values: expect.objectContaining({
              playerId: CANONICAL_PLAYER_ONE,
              cardIds: expect.any(Array),
            }),
          }),
        ]),
      },
    });
  });
  it("opens a discard chooser when no targets are submitted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [
        desperatePlan,
        mickeyMouseArtfulRogue,
        mickeyMouseDetective,
        goofyKnightForADay,
        mickeyMouseTrumpeter,
      ],
      inkwell: desperatePlan.cost,
      deck: [goofyKnightForADay, goofyKnightForADay, goofyKnightForADay],
    });

    expect(testEngine.asPlayerOne().playCard(desperatePlan)).toBeSuccessfulCommand();

    const pendingEffect = testEngine.asPlayerOne().getPendingEffects()[0];
    const selectionContext = pendingEffect?.selectionContext;
    expect(selectionContext?.kind).toBe("discard-choice");
    if (selectionContext?.kind !== "discard-choice") {
      throw new Error("Expected a discard-choice prompt");
    }
    expect(selectionContext.minSelections).toBe(0);
    expect(selectionContext.maxSelections).toBe(4);

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [mickeyMouseArtfulRogue, mickeyMouseDetective],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 4, deck: 1, discard: 3 });
  });

  it("allows choosing zero cards in the discard branch", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [desperatePlan, mickeyMouseTrumpeter, mickeyMouseFriendlyFace],
      inkwell: desperatePlan.cost,
      deck: [goofyKnightForADay],
    });

    expect(
      testEngine.asPlayerOne().playCard(desperatePlan, { targets: [] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 1, discard: 1 });
  });
});
