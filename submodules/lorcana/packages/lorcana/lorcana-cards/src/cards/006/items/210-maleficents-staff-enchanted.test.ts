import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { wakeUpAlice } from "../../007/actions/116-wake-up-alice";
import { maleficentsStaffEnchanted } from "./210-maleficents-staff-enchanted";

const opponent = createMockCharacter({
  id: "maleficents-staff-enchanted-opponent",
  name: "Opponent",
  cost: 2,
  strength: 1,
  willpower: 3,
});

describe("Maleficent's Staff (Enchanted)", () => {
  it("BACK, FOOLS!: gains 1 lore when an opponent's character is returned to their hand from play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: wakeUpAlice.cost,
        play: [maleficentsStaffEnchanted],
        hand: [wakeUpAlice],
      },
      {
        play: [opponent],
      },
    );

    expect(testEngine.asServer().manualSetDamage(opponent, 1)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCard(wakeUpAlice, {
        targets: [opponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });
});
