import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { meridaFormidableArcherIconic } from "./242-merida-formidable-archer-iconic";

const threeArrowsMock = createMockAction({
  id: "three-arrows-iconic-mock",
  name: "Three Arrows",
  cost: 3,
});

describe("Merida - Formidable Archer (Iconic)", () => {
  it("FULL QUIVER - returns Three Arrows from discard to hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [meridaFormidableArcherIconic],
        discard: [threeArrowsMock],
        inkwell: meridaFormidableArcherIconic.cost,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(meridaFormidableArcherIconic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(meridaFormidableArcherIconic, {
        resolveOptional: true,
        targets: [threeArrowsMock],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(threeArrowsMock)).toBe("hand");
  });
});
