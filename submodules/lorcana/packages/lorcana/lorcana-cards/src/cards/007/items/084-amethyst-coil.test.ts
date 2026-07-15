import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { amethystCoil } from "./084-amethyst-coil";

const inkCard = createMockCharacter({
  id: "amethyst-coil-ink-card",
  name: "Amethyst Coil Ink Card",
  cost: 1,
});

const damagedSource = createMockCharacter({
  id: "amethyst-coil-damaged-source",
  name: "Amethyst Coil Damaged Source",
  cost: 2,
});

const opposingTarget = createMockCharacter({
  id: "amethyst-coil-opposing-target",
  name: "Amethyst Coil Opposing Target",
  cost: 2,
});

describe("Amethyst Coil", () => {
  it("moves 1 damage from the chosen character to the chosen opposing character when you ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [inkCard],
        play: [amethystCoil, damagedSource],
      },
      {
        play: [opposingTarget],
      },
    );

    testEngine.asServer().manualSetDamage(damagedSource, 2);

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(amethystCoil, {
        resolveOptional: true,
        targets: [damagedSource, opposingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedSource, value: 1 });
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: opposingTarget, value: 1 });
  });
});
