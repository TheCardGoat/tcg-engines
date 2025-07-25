import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { arielOnHumanLegs } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { LorcanaTestEngine } from "../../testing/lorcana-test-engine";

describe("Voiceless Ability", () => {
  it("should be able to play a card", async () => {
    const testEngine = new LorcanaTestEngine({
      play: [arielOnHumanLegs],
    });
  });
});
