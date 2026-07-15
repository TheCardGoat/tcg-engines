import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { madHattersTeapot } from "./066-mad-hatters-teapot";

const milledCard = createMockCharacter({
  id: "mad-hatters-teapot-milled-card",
  name: "Milled Card",
  cost: 1,
});

describe("Mad Hatter's Teapot", () => {
  it("mills the top card of each opponent's deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        inkwell: 1,
        play: [madHattersTeapot],
      },
      {
        deck: [milledCard],
      },
    );

    expect(testEngine.asPlayerOne().activateAbility(madHattersTeapot)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(milledCard)).toBe("discard");
  });
});
