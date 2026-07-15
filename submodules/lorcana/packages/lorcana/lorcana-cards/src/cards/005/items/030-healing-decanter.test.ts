import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { healingDecanter } from "./030-healing-decanter";

const woundedAlly = createMockCharacter({
  id: "healing-decanter-target",
  name: "Wounded Ally",
  cost: 2,
});

describe("Healing Decanter", () => {
  it("removes up to 2 damage from the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [],
      play: [healingDecanter, woundedAlly],
    });

    testEngine.asServer().manualSetDamage(woundedAlly, 3);

    expect(
      testEngine.asPlayerOne().activateAbility(healingDecanter, {
        targets: [woundedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(woundedAlly)).toBe(1);
  });
});
