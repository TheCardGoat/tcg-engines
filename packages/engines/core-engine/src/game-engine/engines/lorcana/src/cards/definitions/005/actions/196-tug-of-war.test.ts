import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { tugofwar } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { mickeyMouseGiantMouse } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
