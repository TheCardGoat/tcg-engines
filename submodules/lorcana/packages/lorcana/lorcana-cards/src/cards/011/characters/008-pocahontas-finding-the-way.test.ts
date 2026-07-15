import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { pocahontasFindingTheWay } from "./008-pocahontas-finding-the-way";

describe("Pocahontas - Finding the Way", () => {
  it("DISCOVERY AWAITS - triggers when played and creates bag for target selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pocahontasFindingTheWay],
      inkwell: pocahontasFindingTheWay.cost,
      play: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(pocahontasFindingTheWay)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(pocahontasFindingTheWay)).toBe("play");

    // The when-played trigger creates a bag effect for target selection
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Resolve the bag by choosing Simba as the target for +1 lore
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [simbaProtectiveCub] }),
    ).toBeSuccessfulCommand();
  });
});
