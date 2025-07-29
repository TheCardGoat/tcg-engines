/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  arielSpectacularSinger,
  mickeyBraveLittleTailor,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { magicalManeuvers } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
