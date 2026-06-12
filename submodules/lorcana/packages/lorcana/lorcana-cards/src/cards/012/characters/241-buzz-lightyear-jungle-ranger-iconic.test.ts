import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { buzzLightyearJungleRangerIconic } from "./241-buzz-lightyear-jungle-ranger-iconic";

const discardedAction = createMockAction({
  id: "buzz-discarded-action",
  name: "Discarded Action",
  cost: 5,
});

describe("Buzz Lightyear - Jungle Ranger (Iconic)", () => {
  it("TAKE CHARGE - returns action from discard to hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [buzzLightyearJungleRangerIconic],
        discard: [discardedAction],
        inkwell: buzzLightyearJungleRangerIconic.cost,
      },
      {
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(buzzLightyearJungleRangerIconic),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(buzzLightyearJungleRangerIconic, {
        resolveOptional: true,
        targets: [discardedAction],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardedAction)).toBe("hand");
  });
});
