import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { paradiseFallsExoticDestination } from "./108-paradise-falls-exotic-destination";

const paradiseVisitor = createMockCharacter({
  id: "paradise-falls-visitor",
  name: "Paradise Visitor",
  cost: 2,
});

describe("Paradise Falls - Exotic Destination", () => {
  it("gets +3 lore while you have a character there", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        paradiseFallsExoticDestination,
        { card: paradiseVisitor, atLocation: paradiseFallsExoticDestination },
      ],
    });

    expect(testEngine.getCard(paradiseFallsExoticDestination).lore).toBe(4);
  });
});
