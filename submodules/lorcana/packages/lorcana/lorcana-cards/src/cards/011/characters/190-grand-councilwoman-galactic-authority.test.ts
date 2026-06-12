import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { grandCouncilwomanGalacticAuthority } from "./190-grand-councilwoman-galactic-authority";

describe("Grand Councilwoman - Galactic Authority", () => {
  it("is a vanilla character with the printed stats and no abilities", () => {
    expect(grandCouncilwomanGalacticAuthority.cost).toBe(4);
    expect(grandCouncilwomanGalacticAuthority.strength).toBe(3);
    expect(grandCouncilwomanGalacticAuthority.willpower).toBe(5);
    expect(grandCouncilwomanGalacticAuthority.lore).toBe(3);
    expect(grandCouncilwomanGalacticAuthority.inkable).toBe(false);
    expect(grandCouncilwomanGalacticAuthority.vanilla).toBe(true);
    expect(grandCouncilwomanGalacticAuthority.classifications).toEqual(["Dreamborn", "Alien"]);
    expect(grandCouncilwomanGalacticAuthority.abilities).toEqual([]);

    const testEngine = new LorcanaTestEngine({
      play: [grandCouncilwomanGalacticAuthority],
    });

    const cardUnderTest = testEngine.getCardModel(grandCouncilwomanGalacticAuthority);
    expect(cardUnderTest.hasAbility).toBe(false);
    expect(cardUnderTest.canQuest()).toBe(true);
  });

  it("can be played onto the board", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [grandCouncilwomanGalacticAuthority],
      inkwell: grandCouncilwomanGalacticAuthority.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(grandCouncilwomanGalacticAuthority),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(grandCouncilwomanGalacticAuthority)).toBe("play");
  });
});
