import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { letItGo } from "@tcg/lorcana-cards/cards/001";
import { mickeyMouseAmberChampion, shantiVillageGirl } from "@tcg/lorcana-cards/cards/010";
import { chiefPowhatanProtectiveLeader } from "@tcg/lorcana-cards/cards/011";

/**
 * THE-959:
 * Let It Go targeting Mickey Mouse - Amber Champion must remove Mickey's +2 willpower aura.
 * Any damaged Amber character that becomes lethal after the aura is gone should be banished.
 */
describe("THE-959 — Let It Go on Mickey with damaged Amber allies", () => {
  it("banishes all newly lethal damaged Amber characters after Mickey enters inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          mickeyMouseAmberChampion,
          { card: chiefPowhatanProtectiveLeader, damage: 5 },
          { card: shantiVillageGirl, damage: 5 },
        ],
        deck: 1,
      },
      {
        hand: [letItGo],
        inkwell: letItGo.cost,
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().playCard(letItGo, {
        targets: [mickeyMouseAmberChampion],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseAmberChampion)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(chiefPowhatanProtectiveLeader)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(shantiVillageGirl)).toBe("discard");
  });
});
