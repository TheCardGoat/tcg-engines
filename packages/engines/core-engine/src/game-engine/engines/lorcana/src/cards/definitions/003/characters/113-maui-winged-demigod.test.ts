import { describe, expect, it } from "bun:test";
import {
  heiheiAccidentalExplorer,
  mauiWingedDemigod,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { heiheiBumblingRooster } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { stitchTeamUnderdog } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Maui - Winged Demigod", () => {
  it("**Reckless** _(They can’t quest and must challenge if able.)_", () => {
    const testStore = new TestStore({
      play: [mauiWingedDemigod],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mauiWingedDemigod.id,
    );
    expect(cardUnderTest.hasReckless()).toBe(true);
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
    expect(cardUnderTest.hasReckless()).toBe(true);

    await testEngine.questCard(heiheiBumblingRooster);
    expect(cardUnderTest.lore).toBe(mauiWingedDemigod.lore + 1);
    // expect(cardUnderTest.hasReckless()).toBe(false);

    await testEngine.questCard(heiheiAccidentalExplorer);
    expect(cardUnderTest.lore).toBe(mauiWingedDemigod.lore + 2);
    // expect(cardUnderTest.hasReckless()).toBe(false);
  });
});
