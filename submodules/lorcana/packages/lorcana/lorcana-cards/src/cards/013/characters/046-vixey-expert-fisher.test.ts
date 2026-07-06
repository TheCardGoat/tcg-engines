import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { vixeyExpertFisher } from "./046-vixey-expert-fisher";

const evasiveAlly = createMockCharacter({
  id: "vixey-evasive-ally",
  name: "Vixey Evasive Ally",
  cost: 2,
  abilities: [evasive],
});

const lowCostItem = createMockItem({
  id: "vixey-low-cost-item",
  name: "Low Cost Item",
  cost: 2,
});

describe("Vixey - Expert Fisher", () => {
  it("may return a chosen low-cost character, item, or location when you have Evasive in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [vixeyExpertFisher],
        inkwell: vixeyExpertFisher.cost,
        play: [evasiveAlly],
      },
      {
        play: [lowCostItem],
      },
    );

    expect(testEngine.asPlayerOne().playCard(vixeyExpertFisher)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(vixeyExpertFisher, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [lowCostItem] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(lowCostItem)).toBe("hand");
  });
});
