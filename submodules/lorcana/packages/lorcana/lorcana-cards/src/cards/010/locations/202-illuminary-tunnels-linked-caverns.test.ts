import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { castleWyvernAboveTheClouds } from "./204-castle-wyvern-above-the-clouds";
import { zootopiaPoliceHeadquarters } from "./203-zootopia-police-headquarters";
import { illuminaryTunnelsLinkedCaverns } from "./202-illuminary-tunnels-linked-caverns";

const tunnelsGuide = createMockCharacter({
  id: "tunnels-guide",
  name: "Tunnels Guide",
  cost: 2,
});

describe("Illuminary Tunnels - Linked Caverns", () => {
  it("gets lore and reduces location costs while you have a character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [illuminaryTunnelsLinkedCaverns, zootopiaPoliceHeadquarters, tunnelsGuide],
      hand: [castleWyvernAboveTheClouds],
      inkwell: 2,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(illuminaryTunnelsLinkedCaverns).lore).toBe(1);
    expect(testEngine.asPlayerOne().getCard(castleWyvernAboveTheClouds).playCost).toBe(
      castleWyvernAboveTheClouds.cost,
    );

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(tunnelsGuide, illuminaryTunnelsLinkedCaverns)
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(illuminaryTunnelsLinkedCaverns).lore).toBe(2);
    expect(testEngine.asPlayerOne().getCard(castleWyvernAboveTheClouds).playCost).toBe(1);
  });
});
