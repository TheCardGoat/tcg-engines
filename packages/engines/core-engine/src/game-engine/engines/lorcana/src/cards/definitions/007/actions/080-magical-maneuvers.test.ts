import { describe, expect, it } from "bun:test";
import {
  arielSpectacularSinger,
  mickeyBraveLittleTailor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { magicalManeuvers } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Magical Maneuvers", () => {
  it("Return chosen character of yours to your hand. Exert chosen character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: magicalManeuvers.cost,
        hand: [magicalManeuvers],
        play: [arielSpectacularSinger],
      },
      {
        play: [mickeyBraveLittleTailor],
      },
    );

    await testEngine.playCard(magicalManeuvers);

    // First effect: Return your character to hand
    await testEngine.resolveTopOfStack(
      { targets: [arielSpectacularSinger] },
      true,
    );
    expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe("hand");

    // Second effect: Exert any character
    await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
    expect(testEngine.getCardModel(mickeyBraveLittleTailor).exerted).toBe(true);
  });
});
