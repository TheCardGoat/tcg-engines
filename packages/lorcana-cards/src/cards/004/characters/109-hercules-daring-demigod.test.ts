import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { herculesDaringDemigod } from "./109-hercules-daring-demigod";

describe("Hercules - Daring Demigod", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesDaringDemigod],
    });

    const cardUnderTest = testEngine.getCardModel(herculesDaringDemigod);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesDaringDemigod],
    });

    const cardUnderTest = testEngine.getCardModel(herculesDaringDemigod);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { herculesDaringDemigod } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hercules - Daring Demigod", () => {
//   it("**Rush** _(This character can challenge the turn they're played.)_**Reckless** _(This character can't quest and must challenge each turn if able.)_", () => {
//     const testStore = new TestStore({
//       play: [herculesDaringDemigod],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       herculesDaringDemigod.id,
//     );
//     expect(cardUnderTest.hasRush).toBe(true);
//     expect(cardUnderTest.hasReckless).toBe(true);
//   });
// });
//
// describe("Regression", () => {
//   it("Can challenge with fresh ink", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: herculesDaringDemigod.cost,
//         hand: [herculesDaringDemigod],
//       },
//       {
//         play: [moanaOfMotunui],
//       },
//     );
//
//     const attacker = testStore.getByZoneAndId("hand", herculesDaringDemigod.id);
//     testStore.store.playCardFromHand(attacker.instanceId);
//
//     const defender = testStore.getCard(moanaOfMotunui);
//     defender.updateCardMeta({ exerted: true });
//
//     attacker.challenge(defender);
//
//     expect(
//       testStore.store.tableStore.getTable("player_one").turn.challenges,
//     ).toHaveLength(1);
//     expect(attacker.meta.damage).toEqual(1);
//     expect(defender.zone).toEqual("discard");
//   });
// });
//
