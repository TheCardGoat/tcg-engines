import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mulanDisguisedSoldier } from "./193-mulan-disguised-soldier";

const drawnCard = createMockCharacter({
  id: "mulan-disguised-soldier-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "mulan-disguised-soldier-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Mulan - Disguised Soldier", () => {
  it("can't decline the discard after accepting the optional draw effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [mulanDisguisedSoldier, discardFodder],
      inkwell: mulanDisguisedSoldier.cost,
    });

    expect(testEngine.asPlayerOne().playCard(mulanDisguisedSoldier)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mulanDisguisedSoldier, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().resolveNextPending({ resolveOptional: false }).success).toBe(
      false,
    );
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("hand");
  });

  it("may draw a card, then choose and discard a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [mulanDisguisedSoldier, discardFodder],
      inkwell: mulanDisguisedSoldier.cost,
    });

    expect(testEngine.asPlayerOne().playCard(mulanDisguisedSoldier)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mulanDisguisedSoldier, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

    const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardFodderId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
