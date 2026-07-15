import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { inscrutableMap } from "./099-inscrutable-map";

const opposingScout = createMockCharacter({
  id: "inscrutable-map-opposing-scout",
  name: "Opposing Scout",
  cost: 2,
  lore: 2,
});

describe("Inscrutable Map", () => {
  it("gives the chosen opposing character -1 lore until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        inkwell: 1,
        play: [inscrutableMap],
      },
      {
        deck: 2,
        play: [opposingScout],
      },
    );
    const baseLore = testEngine.asPlayerTwo().getCardLore(opposingScout);

    expect(
      testEngine.asPlayerOne().activateAbility(inscrutableMap, {
        targets: [opposingScout],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardLore(opposingScout)).toBe(baseLore - 1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardLore(opposingScout)).toBe(baseLore - 1);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardLore(opposingScout)).toBe(baseLore);
  });
});
