import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { fergusOutpostBuilder } from "./194-fergus-outpost-builder";

const locA = createMockLocation({
  id: "fergus-two-step-loc-a",
  name: "Loc A",
  cost: 3,
  willpower: 5,
  moveCost: 1,
});

const locB = createMockLocation({
  id: "fergus-two-step-loc-b",
  name: "Loc B",
  cost: 4,
  willpower: 5,
  moveCost: 1,
});

describe("Fergus two-step bag (accept then pick)", () => {
  it("accepting the optional first surfaces a target-selection for the location pick", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [fergusOutpostBuilder, locA],
        hand: [locB],
        inkwell: 5,
        deck: 5,
      },
      { deck: 5 },
    );
    expect(testEngine.asPlayerOne().quest(fergusOutpostBuilder)).toBeSuccessfulCommand();

    // Step 1: accept the optional WITHOUT targets. Engine should advance the bag
    // to expose a card-pick context (cardCandidateIds, allowedZones hand/discard).
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fergusOutpostBuilder, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // Bag should still have an entry (now in card-pick phase), and the bag's
    // selectionContext should advertise the locations as candidates.
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects.length).toBeGreaterThan(0);
    const ctx = bagEffects[0]?.selectionContext;
    if (ctx?.kind !== "target-selection") {
      throw new Error(`expected target-selection context, got ${ctx?.kind ?? "undefined"}`);
    }
    expect(ctx.allowedZones).toEqual(expect.arrayContaining(["hand"]));

    const locBId = testEngine.findCardInstanceId(locB, "hand");
    expect(ctx.cardCandidateIds).toEqual(expect.arrayContaining([locBId]));

    // Step 2: send targets — this resolves the play-card effect.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fergusOutpostBuilder, {
        targets: [locBId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(locB)).toBe("play");
  });
});
