import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { amberCoil } from "./041-amber-coil";

const inkCard = createMockCharacter({
  id: "amber-coil-ink-card",
  name: "Amber Coil Ink Card",
  cost: 1,
});

const damagedTarget = createMockCharacter({
  id: "amber-coil-damaged-target",
  name: "Amber Coil Damaged Target",
  cost: 2,
});

describe("Amber Coil", () => {
  it("removes up to 2 damage when you ink a card during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkCard],
      play: [amberCoil, damagedTarget],
    });

    testEngine.asServer().manualSetDamage(damagedTarget, 3);

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(amberCoil)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [damagedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedTarget, value: 1 });
  });

  it("lets you decline the healing trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkCard],
      play: [amberCoil, damagedTarget],
    });

    testEngine.asServer().manualSetDamage(damagedTarget, 2);

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(amberCoil, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedTarget, value: 2 });
  });
});
