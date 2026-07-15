import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { carlFredricksenOnTheMove } from "./113-carl-fredricksen-on-the-move";

const otherCharacter = createMockCharacter({
  id: "carl-on-the-move-other-character",
  name: "Other Character",
  cost: 2,
});

const testLocation = createMockLocation({
  id: "carl-on-the-move-location",
  name: "Test Location",
  cost: 2,
  moveCost: 2,
  lore: 2,
});

const firstDraw = createMockCharacter({
  id: "carl-on-the-move-first-draw",
  name: "First Draw",
  cost: 1,
});

const secondDraw = createMockCharacter({
  id: "carl-on-the-move-second-draw",
  name: "Second Draw",
  cost: 1,
});

describe("Carl Fredricksen - On the Move", () => {
  it("presents Moving Partner as a single optional target prompt", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [testLocation],
      inkwell: testLocation.cost,
      play: [carlFredricksenOnTheMove, otherCharacter],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(testLocation)).toBeSuccessfulCommand();

    const board = testEngine.asPlayerOne().getBoard();
    const bagEffect = board.bagEffects[0];
    const otherCharacterId = testEngine.findCardInstanceId(otherCharacter, "play");

    expect(bagEffect?.selectionContext).toMatchObject({
      kind: "target-selection",
      originatesFromOptional: true,
      canDeclineSelection: true,
      autoResolvedSlots: ["subject"],
    });
    if (!bagEffect?.selectionContext || bagEffect.selectionContext.kind !== "target-selection") {
      throw new Error("Expected Moving Partner to start as a target-selection prompt");
    }
    expect(bagEffect.selectionContext.cardCandidateIds).toContain(otherCharacterId);
  });

  it("presents Moving Partner as a single prompt when only Carl can move", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [testLocation],
      inkwell: testLocation.cost,
      play: [carlFredricksenOnTheMove],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(testLocation)).toBeSuccessfulCommand();

    const board = testEngine.asPlayerOne().getBoard();
    const bagEffect = board.bagEffects[0];

    expect(bagEffect?.selectionContext).toMatchObject({
      kind: "target-selection",
      originatesFromOptional: true,
      canDeclineSelection: true,
      autoResolvedSlots: ["subject"],
      cardCandidateIds: [],
      minSelections: 0,
    });
  });

  it("can decline Moving Partner without moving Carl", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [testLocation],
      inkwell: testLocation.cost,
      play: [carlFredricksenOnTheMove, otherCharacter],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(testLocation)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(carlFredricksenOnTheMove, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).not.toBeAtLocation({
      card: carlFredricksenOnTheMove,
      location: testLocation,
    });
    expect(testEngine.asPlayerOne()).not.toBeAtLocation({
      card: otherCharacter,
      location: testLocation,
    });

    const publicLogKeys = testEngine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((log) => log.public.map((message) => message.key));
    expect(publicLogKeys).toContain("lorcana.effect.resolve.optionalSelection.rejected");
  });

  it("can move only Carl to the location you play for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [testLocation],
      inkwell: testLocation.cost,
      play: [carlFredricksenOnTheMove, otherCharacter],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(testLocation)).toBeSuccessfulCommand();
    const carlId = testEngine.findCardInstanceId(carlFredricksenOnTheMove, "play");
    const locationId = testEngine.findCardInstanceId(testLocation, "play");
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(carlFredricksenOnTheMove, {
        resolveOptional: true,
        targets: {
          kind: "move-to-location",
          subject: [carlId],
          location: [locationId],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: carlFredricksenOnTheMove,
      location: testLocation,
    });
    expect(testEngine.asPlayerOne()).not.toBeAtLocation({
      card: otherCharacter,
      location: testLocation,
    });
  });

  it("moves Carl and another character to the location you play for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [testLocation],
      inkwell: testLocation.cost,
      play: [carlFredricksenOnTheMove, otherCharacter],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(testLocation)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(carlFredricksenOnTheMove, {
        resolveOptional: true,
        targets: [otherCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: carlFredricksenOnTheMove,
      location: testLocation,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: otherCharacter,
      location: testLocation,
    });
  });

  it("draws cards equal to the location's lore when he quests there", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: carlFredricksenOnTheMove, atLocation: testLocation, isDrying: false },
        testLocation,
      ],
      deck: [firstDraw, secondDraw],
    });

    expect(testEngine.asPlayerOne().quest(carlFredricksenOnTheMove)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(firstDraw)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(secondDraw)).toBe("hand");
  });
});
