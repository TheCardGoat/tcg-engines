import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rightBehindYou } from "@tcg/lorcana-cards/cards/012";

const sevenDwarfsInPlay = createMockCharacter({
  id: "rby-seven-dwarfs-play",
  name: "Seven Dwarfs Character",
  cost: 2,
  classifications: ["Seven Dwarfs"],
});

const princessInPlay = createMockCharacter({
  id: "rby-princess-play",
  name: "Princess Character",
  cost: 2,
  classifications: ["Princess"],
});

const sevenDwarfsInHand = createMockCharacter({
  id: "rby-seven-dwarfs-hand",
  name: "Seven Dwarfs Character (Hand)",
  cost: 4,
  classifications: ["Seven Dwarfs"],
});

describe("RIGHT BEHIND YOU - Draw a card. If you have a Seven Dwarfs character and a Princess character in play, you may play a Seven Dwarfs character for free.", () => {
  it("should offer the optional when both Seven Dwarfs and Princess are in play", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, sevenDwarfsInHand],
      inkwell: rightBehindYou.cost,
      play: [sevenDwarfsInPlay, princessInPlay],
      deck: 3,
    });

    expect(engine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);
  });

  it("should NOT offer the optional when only Seven Dwarfs (no Princess) is in play", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, sevenDwarfsInHand],
      inkwell: rightBehindYou.cost,
      play: [sevenDwarfsInPlay],
      deck: 3,
    });

    expect(engine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getCardZone(sevenDwarfsInHand)).toBe("hand");
  });

  it("should NOT offer the optional when only Princess (no Seven Dwarfs) is in play", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, sevenDwarfsInHand],
      inkwell: rightBehindYou.cost,
      play: [princessInPlay],
      deck: 3,
    });

    expect(engine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getCardZone(sevenDwarfsInHand)).toBe("hand");
  });

  it("should NOT offer the optional when no Seven Dwarfs or Princess is in play, even with a Seven Dwarfs in hand", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, sevenDwarfsInHand],
      inkwell: rightBehindYou.cost,
      deck: 3,
    });

    expect(engine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getCardZone(sevenDwarfsInHand)).toBe("hand");
  });

  it("should play the Seven Dwarfs character for free when optional is accepted", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, sevenDwarfsInHand],
      inkwell: rightBehindYou.cost,
      play: [sevenDwarfsInPlay, princessInPlay],
      deck: 3,
    });

    expect(engine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(
      engine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [sevenDwarfsInHand],
      }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getCardZone(sevenDwarfsInHand)).toBe("play");
  });

  it("should not play the character when optional is declined", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rightBehindYou, sevenDwarfsInHand],
      inkwell: rightBehindYou.cost,
      play: [sevenDwarfsInPlay, princessInPlay],
      deck: 3,
    });

    expect(engine.asPlayerOne().playCard(rightBehindYou)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(
      engine.asPlayerOne().resolveNextPending({
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getCardZone(sevenDwarfsInHand)).toBe("hand");
  });
});
