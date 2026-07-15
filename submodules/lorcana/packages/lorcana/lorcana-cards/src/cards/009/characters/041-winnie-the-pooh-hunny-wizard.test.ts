import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { winnieThePoohHunnyWizard } from "./041-winnie-the-pooh-hunny-wizard";

describe("Winnie the Pooh - Hunny Wizard", () => {
  it("has no implemented abilities and is not marked missing", () => {
    const testEngine = new LorcanaTestEngine({
      play: [winnieThePoohHunnyWizard],
    });
    const abilities = winnieThePoohHunnyWizard.abilities ?? [];

    expect(winnieThePoohHunnyWizard.missingImplementation).toBeUndefined();
    expect(winnieThePoohHunnyWizard.missingTests).toBeUndefined();
    expect(abilities).toHaveLength(0);
    expect(testEngine.getCardModel(winnieThePoohHunnyWizard).hasAbility).toBe(false);
  });
});
