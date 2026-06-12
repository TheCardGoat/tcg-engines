import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { docBoldKnight } from "./193-doc-bold-knight";
import { ladyFamilyDog } from "../../008";

const kingVictorious = createMockCharacter({
  id: "doc-king-victorious",
  name: "King Victorious",
  cost: 3,
});

const mischievousCub = createMockCharacter({
  id: "doc-mischievous-cub",
  name: "Mischievous Cub",
  cost: 2,
});

const ukulelePlayer = createMockCharacter({
  id: "doc-ukulele-player",
  name: "Ukulele Player",
  cost: 2,
});

const northernMoose = createMockCharacter({
  id: "doc-northern-moose",
  name: "Northern Moose",
  cost: 4,
});

const drawOne = createMockCharacter({ id: "doc-draw-one", name: "Draw One", cost: 1 });
const drawTwo = createMockCharacter({ id: "doc-draw-two", name: "Draw Two", cost: 1 });
const drawThree = createMockCharacter({ id: "doc-draw-three", name: "Draw Three", cost: 1 });

describe("Doc - Bold Knight", () => {
  it("may discard your hand to draw 2 cards when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [docBoldKnight, kingVictorious, mischievousCub, ukulelePlayer, northernMoose],
      inkwell: docBoldKnight.cost,
      deck: [drawOne, drawTwo, drawThree],
    });

    expect(testEngine.asPlayerOne().playCard(docBoldKnight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(docBoldKnight, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 2,
        deck: 1,
        discard: 4,
      }),
    );
  });

  it("Can be played with an empty hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [docBoldKnight],
      inkwell: docBoldKnight.cost,
      deck: [drawOne, drawTwo, drawThree],
    });

    expect(testEngine.asPlayerOne().playCard(docBoldKnight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(docBoldKnight, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 2,
        deck: 1,
      }),
    );
  });

  it("regression: triggers draw ability when played for free (e.g., cost reduction to 0)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [docBoldKnight, ladyFamilyDog],
      inkwell: ladyFamilyDog.cost,
      deck: [drawOne, drawTwo, drawThree],
    });

    expect(testEngine.asPlayerOne().playCard(ladyFamilyDog)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ladyFamilyDog, { targets: [docBoldKnight] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        play: 2,
        hand: 0,
      }),
    );

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(docBoldKnight, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 2,
      }),
    );
  });

  it("automation declines DRASTIC MEASURES when keeping a larger inkable hand is better", () => {
    const largeInkableOne = createMockCharacter({
      id: "doc-automation-large-inkable-1",
      name: "Large Inkable 1",
      cost: 1,
    });
    const largeInkableTwo = createMockCharacter({
      id: "doc-automation-large-inkable-2",
      name: "Large Inkable 2",
      cost: 2,
    });
    const largeInkableThree = createMockCharacter({
      id: "doc-automation-large-inkable-3",
      name: "Large Inkable 3",
      cost: 3,
    });
    const largeInkableFour = createMockCharacter({
      id: "doc-automation-large-inkable-4",
      name: "Large Inkable 4",
      cost: 4,
    });
    const largeUninkable = createMockCharacter({
      id: "doc-automation-large-uninkable",
      name: "Large Uninkable",
      cost: 5,
      inkable: false,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [
        docBoldKnight,
        largeInkableOne,
        largeInkableTwo,
        largeInkableThree,
        largeInkableFour,
        largeUninkable,
      ],
      inkwell: docBoldKnight.cost,
      deck: [drawOne, drawTwo, drawThree],
    });

    expect(testEngine.asPlayerOne().playCard(docBoldKnight)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    const result = testEngine.asPlayerOne().takeAutomatedAction();

    expect(result.selectedCandidate).toEqual({
      family: "resolveBag",
      bagId: bagEffect!.id,
      resolveOptional: false,
    });
    expect(result.finalResult.success).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 5,
        discard: 0,
        play: 1,
      }),
    );
  });
});
