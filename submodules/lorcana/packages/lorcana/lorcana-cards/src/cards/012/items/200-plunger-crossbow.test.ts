import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { plungerCrossbow } from "./200-plunger-crossbow";

const drawnCard = createMockCharacter({
  id: "plunger-crossbow-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardTarget = createMockCharacter({
  id: "plunger-crossbow-discard-target",
  name: "Discard Target",
  cost: 1,
});

describe("Plunger Crossbow", () => {
  it("SUCTION TECHNOLOGY - exert and pay 2 ink to draw a card, then choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [discardTarget],
      deck: [drawnCard],
      inkwell: 2,
      play: [plungerCrossbow],
    });

    const discardTargetId = testEngine.findCardInstanceId(discardTarget, "hand", "p1");

    expect(
      testEngine.asPlayerOne().activateAbility(plungerCrossbow, {
        ability: "SUCTION TECHNOLOGY",
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardTargetId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardTarget)).toBe("discard");
  });
});
