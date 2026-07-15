import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { fredMajorScienceEnthusiast } from "./092-fred-major-science-enthusiast";

const itemToBanish = createMockItem({
  id: "fred-major-science-item",
  name: "Science Gadget",
  cost: 2,
});

describe("Fred - Major Science Enthusiast", () => {
  it("may banish a chosen item when you play him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fredMajorScienceEnthusiast],
        inkwell: fredMajorScienceEnthusiast.cost,
      },
      {
        play: [itemToBanish],
      },
    );

    expect(testEngine.asPlayerOne().playCard(fredMajorScienceEnthusiast)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fredMajorScienceEnthusiast, {
        resolveOptional: true,
        targets: [itemToBanish],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(itemToBanish)).toBe("discard");
  });
});
