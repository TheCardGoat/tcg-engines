/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  heiheiAccidentalExplorer,
  mauiWingedDemigod,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { heiheiBumblingRooster } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { stitchTeamUnderdog } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Maui - Winged Demigod", () => {
  it("**Reckless** _(They can’t quest and must challenge if able.)_", () => {
    const testStore = new TestStore({
      play: [mauiWingedDemigod],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mauiWingedDemigod.id,
    );
    expect(cardUnderTest.hasReckless).toBe(true);
  });

  it("**IN MY STOMACH** Whenever one of your characters named Heihei quests, this character gets +1 {L} and loses **Reckless** for this turn.", async () => {
    const testEngine = new TestEngine({
      play: [
        mauiWingedDemigod,
        heiheiBumblingRooster,
        heiheiAccidentalExplorer,
        stitchTeamUnderdog,
      ],
    });

    const cardUnderTest = testEngine.getCardModel(mauiWingedDemigod);

    await testEngine.questCard(stitchTeamUnderdog);
    expect(cardUnderTest.lore).toBe(mauiWingedDemigod.lore);
    expect(cardUnderTest.hasReckless).toBe(true);

    await testEngine.questCard(heiheiBumblingRooster);
    expect(cardUnderTest.lore).toBe(mauiWingedDemigod.lore + 1);
    // expect(cardUnderTest.hasReckless).toBe(false);

    await testEngine.questCard(heiheiAccidentalExplorer);
    expect(cardUnderTest.lore).toBe(mauiWingedDemigod.lore + 2);
    // expect(cardUnderTest.hasReckless).toBe(false);
  });
});
