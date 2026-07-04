import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sproutExperiment509 } from "./179-sprout-experiment-509";

const alienDiscard = createMockCharacter({
  id: "sprout-experiment-509-alien-discard",
  name: "Alien Discard",
  cost: 1,
  classifications: ["Storyborn", "Alien"],
});

const damageTarget = createMockCharacter({
  id: "sprout-experiment-509-damage-target",
  name: "Damage Target",
  cost: 2,
  willpower: 5,
});

describe("Sprout - Experiment 509", () => {
  it("has Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sproutExperiment509],
    });

    expect(testEngine.hasKeyword(sproutExperiment509, "Resist")).toBe(true);
  });

  it("may discard an Alien character card to deal 2 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [sproutExperiment509, alienDiscard],
        inkwell: sproutExperiment509.cost,
      },
      {
        play: [damageTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(sproutExperiment509)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sproutExperiment509, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [alienDiscard] }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damageTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(alienDiscard)).toBe("discard");
    expect(testEngine.asPlayerTwo().getDamage(damageTarget)).toBe(2);
  });
});
