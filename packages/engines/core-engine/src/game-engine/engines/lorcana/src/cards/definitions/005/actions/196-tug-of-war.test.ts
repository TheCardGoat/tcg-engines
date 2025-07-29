/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { mickeyMouseGiantMouse } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tugofwar } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Tug-of-War", () => {
  it("• Deal 1 damage to each opposing character without **Evasive**.", async () => {
    const testStore = new TestEngine(
      {
        inkwell: tugofwar.cost,
        hand: [tugofwar],
      },
      {
        play: [mickeyBraveLittleTailor, mickeyMouseGiantMouse],
      },
    );

    await testStore.playCard(tugofwar);
    await testStore.resolveTopOfStack({ mode: "1" });

    expect(testStore.getCardModel(mickeyBraveLittleTailor).damage).toBe(0);
    expect(testStore.getCardModel(mickeyMouseGiantMouse).damage).toBe(1);
  });

  it("• Deal 3 damage to each opposing character with **Evasive**.", async () => {
    const testStore = new TestEngine(
      {
        inkwell: tugofwar.cost,
        hand: [tugofwar],
      },
      {
        play: [mickeyBraveLittleTailor, mickeyMouseGiantMouse],
      },
    );

    await testStore.playCard(tugofwar);
    await testStore.resolveTopOfStack({ mode: "2" });

    expect(testStore.getCardModel(mickeyMouseGiantMouse).damage).toBe(0);
    expect(testStore.getCardModel(mickeyBraveLittleTailor).damage).toBe(3);
  });
});
