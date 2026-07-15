import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theUnderworldRiverStyx } from "./034-the-underworld-river-styx";

const styxQuester = createMockCharacter({
  id: "styx-quester",
  name: "Styx Quester",
  cost: 2,
});

const discardedSoul = createMockCharacter({
  id: "styx-discarded-soul",
  name: "Discarded Soul",
  cost: 3,
});

describe("The Underworld - River Styx", () => {
  it("lets you pay 3 ink when a character quests here to return a character from discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theUnderworldRiverStyx, { card: styxQuester, atLocation: theUnderworldRiverStyx }],
      discard: [discardedSoul],
      inkwell: 3,
      deck: 1,
    });
    const discardedSoulId = testEngine.findCardInstanceId(discardedSoul, "discard", "p1");

    expect(testEngine.asPlayerOne().quest(styxQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(theUnderworldRiverStyx).success).toBe(
      true,
    );
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [discardedSoulId] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(discardedSoul)).toBe("hand");
  });
});
