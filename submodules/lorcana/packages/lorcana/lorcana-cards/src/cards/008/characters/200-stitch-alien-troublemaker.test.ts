import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { stitchAlienTroublemaker } from "./200-stitch-alien-troublemaker";

const fragileOpponent = createMockCharacter({
  id: "stitch-test-fragile-opponent",
  name: "Fragile Opponent",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const toughOpponent = createMockCharacter({
  id: "stitch-test-tough-opponent",
  name: "Tough Opponent",
  cost: 2,
  strength: 2,
  willpower: 10,
  lore: 1,
});

describe("Stitch - Alien Troublemaker", () => {
  it("I WIN! - fires optional ability when this character banishes another character in a challenge during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchAlienTroublemaker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: fragileOpponent, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(stitchAlienTroublemaker, fragileOpponent),
    ).toBeSuccessfulCommand();

    // The optional ability should be in the bag (requires player decision)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    // Accept the optional: draw a card and gain 1 lore
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(stitchAlienTroublemaker, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(handBefore + 1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 1);
  });

  it("I WIN! - optional ability can be declined (no draw, no lore gain)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchAlienTroublemaker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: fragileOpponent, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(stitchAlienTroublemaker, fragileOpponent),
    ).toBeSuccessfulCommand();

    const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    // Decline the optional
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(stitchAlienTroublemaker, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(handBefore);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
  });

  it("I WIN! - does NOT fire when this character survives the challenge without banishing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchAlienTroublemaker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: toughOpponent, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(stitchAlienTroublemaker, toughOpponent),
    ).toBeSuccessfulCommand();

    // No bag effect: the defender was NOT banished
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
