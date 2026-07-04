import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { resist } from "../../../helpers/abilities/resist";
import { piercingAttack } from "./102-piercing-attack";

const resilientTarget = createMockCharacter({
  id: "piercing-attack-resilient-target",
  name: "Resilient Target",
  cost: 3,
  willpower: 5,
  abilities: [resist(2)],
});

describe("Piercing Attack", () => {
  it("deals damage that cannot be reduced by Resist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [piercingAttack],
        inkwell: piercingAttack.cost,
      },
      {
        play: [resilientTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(piercingAttack, {
        targets: [resilientTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asServer().getCard(resilientTarget).damage).toBe(2);
  });
});
