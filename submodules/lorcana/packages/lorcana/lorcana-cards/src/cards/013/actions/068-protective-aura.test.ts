import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { protectiveAura } from "./068-protective-aura";

const floodbornTarget = createMockCharacter({
  id: "protective-aura-floodborn-target",
  name: "Floodborn Target",
  cost: 3,
  classifications: ["Floodborn", "Hero"],
});

const storybornTarget = createMockCharacter({
  id: "protective-aura-storyborn-target",
  name: "Storyborn Target",
  cost: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("Protective Aura", () => {
  it("gives your Floodborn characters Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [protectiveAura],
      inkwell: protectiveAura.cost,
      play: [floodbornTarget, storybornTarget],
    });

    expect(testEngine.asPlayerOne().playCard(protectiveAura)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(floodbornTarget, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(storybornTarget, "Evasive")).toBe(false);
  });
});
