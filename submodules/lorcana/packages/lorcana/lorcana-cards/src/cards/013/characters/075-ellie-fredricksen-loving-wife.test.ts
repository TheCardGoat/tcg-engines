import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { ellieFredricksenLovingWife } from "./075-ellie-fredricksen-loving-wife";

const adventureLocation = createMockLocation({
  id: "ellie-loving-wife-location",
  name: "Adventure Location",
  cost: 2,
  moveCost: 1,
  lore: 1,
});

describe("Ellie Fredricksen - Loving Wife", () => {
  it("gains 1 lore when you play a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [adventureLocation],
      play: [ellieFredricksenLovingWife],
      inkwell: adventureLocation.cost,
    });

    expect(testEngine.asPlayerOne().playCard(adventureLocation)).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ellieFredricksenLovingWife),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
