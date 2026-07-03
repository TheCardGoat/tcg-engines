import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { colonelHathiOnTheMarch } from "./116-colonel-hathi-on-the-march";

const marchingGround = createMockLocation({
  id: "colonel-hathi-marching-ground",
  name: "Marching Ground",
  cost: 2,
  moveCost: 2,
  willpower: 5,
  lore: 1,
});

describe("Colonel Hathi - On the March", () => {
  it("may move to one of your locations for free when he quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [colonelHathiOnTheMarch, marchingGround],
    });

    expect(testEngine.asPlayerOne().quest(colonelHathiOnTheMarch)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(colonelHathiOnTheMarch, {
        resolveOptional: true,
        targets: [marchingGround],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: colonelHathiOnTheMarch,
      location: marchingGround,
    });
  });
});
