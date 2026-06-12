import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { microbots } from "./167-microbots";

const weakenedTarget = createMockCharacter({
  id: "microbots-weakened-target",
  name: "Weakened Target",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Microbots", () => {
  it("allows unlimited copies in your deck", () => {
    expect(microbots.cardCopyLimit).toBe("no-limit");
  });

  it("gives the chosen character -1 strength for each Microbots you have in play when you play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      hand: [microbots],
      inkwell: microbots.cost,
      play: [microbots, weakenedTarget],
    });
    const microbotsInHand = testEngine.findCardInstanceId(microbots, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(microbotsInHand)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const [microbotsTrigger] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(microbotsTrigger!.sourceId, {
        targets: [weakenedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(2);
  });
});
