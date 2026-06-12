import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE } from "@tcg/shared/testing";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { liloRockStar } from "../../011";
import { liloEscapeArtist } from "./002-lilo-escape-artist";

describe("Lilo - Escape Artist", () => {
  it("can be played from discard at the start of your turn and enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        discard: [liloEscapeArtist],
        inkwell: liloEscapeArtist.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(
      liloEscapeArtist.cost,
    );
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(liloEscapeArtist, {
        resolveOptional: true,
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(liloEscapeArtist)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(liloEscapeArtist)).toBe(true);
    expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        play: 1,
        discard: 0,
      }),
    );
  });

  it("creates one trigger per copy in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        discard: [liloEscapeArtist, liloEscapeArtist],
        inkwell: liloEscapeArtist.cost * 2,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
    expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(
      liloEscapeArtist.cost * 2,
    );

    const [firstBagEffect, secondBagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolveBag(firstBagEffect!.id).success).toBe(true);
    expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(
      liloEscapeArtist.cost,
    );
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        play: 1,
        discard: 1,
      }),
    );

    expect(testEngine.asPlayerOne().resolveBag(secondBagEffect!.id).success).toBe(true);
    expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        play: 2,
        discard: 0,
      }),
    );
  });

  it("replays the triggering Escape Artist copy instead of another Lilo in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        discard: [liloEscapeArtist, liloRockStar],
        inkwell: liloEscapeArtist.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id).success).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(liloEscapeArtist)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(liloRockStar)).toBe("discard");
  });

  it("does not resolve if you cannot pay her cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        discard: [liloEscapeArtist],
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id).success).toBe(true);

    expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(liloEscapeArtist)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        play: 0,
        discard: 1,
      }),
    );
  });

  it.todo("regression: re-triggers after being banished and returned to discard", () => {
    const banisher = createMockCharacter({
      id: "lilo-escape-banisher",
      name: "Banisher",
      cost: 2,
      strength: 5,
      willpower: 5,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        discard: [liloEscapeArtist],
        inkwell: liloEscapeArtist.cost * 2,
        deck: [simbaProtectiveCub, simbaProtectiveCub, simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        play: [banisher],
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    // Turn 1: P1 passes, P2 passes -> P1's turn starts, Lilo triggers from discard
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(liloEscapeArtist, {
        resolveOptional: true,
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(liloEscapeArtist)).toBe("play");

    // P1 passes, P2 banishes Lilo (she's exerted from entering play)
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(banisher, liloEscapeArtist)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(liloEscapeArtist)).toBe("discard");

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Lilo should trigger AGAIN from discard at start of P1's next turn
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });

  it("does not trigger while already in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [liloEscapeArtist],
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(liloEscapeArtist)).toBe("play");
  });
});
