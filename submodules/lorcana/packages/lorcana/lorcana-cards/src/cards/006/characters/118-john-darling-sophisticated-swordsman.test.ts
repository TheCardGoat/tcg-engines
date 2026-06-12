import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { johnDarlingSophisticatedSwordsman } from "./118-john-darling-sophisticated-swordsman";

describe("John Darling - Sophisticated Swordsman", () => {
  it("is a vanilla 2/1/4/1 character", () => {
    expect(johnDarlingSophisticatedSwordsman.cost).toBe(2);
    expect(johnDarlingSophisticatedSwordsman.strength).toBe(1);
    expect(johnDarlingSophisticatedSwordsman.willpower).toBe(4);
    expect(johnDarlingSophisticatedSwordsman.lore).toBe(1);
    expect(johnDarlingSophisticatedSwordsman.vanilla).toBe(true);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [johnDarlingSophisticatedSwordsman],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().quest(johnDarlingSophisticatedSwordsman),
    ).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });
});
