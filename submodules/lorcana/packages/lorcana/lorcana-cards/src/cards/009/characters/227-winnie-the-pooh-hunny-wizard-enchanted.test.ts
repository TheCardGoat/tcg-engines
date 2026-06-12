import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { winnieThePoohHunnyWizardEnchanted } from "./227-winnie-the-pooh-hunny-wizard-enchanted";

describe("Winnie the Pooh - Hunny Wizard (Enchanted)", () => {
  it("can be played for its cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [winnieThePoohHunnyWizardEnchanted],
      inkwell: winnieThePoohHunnyWizardEnchanted.cost,
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().playCard(winnieThePoohHunnyWizardEnchanted),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(winnieThePoohHunnyWizardEnchanted)).toBe("play");
  });

  it("has no abilities (vanilla card)", () => {
    expect(winnieThePoohHunnyWizardEnchanted.vanilla).toBe(true);
  });
});
