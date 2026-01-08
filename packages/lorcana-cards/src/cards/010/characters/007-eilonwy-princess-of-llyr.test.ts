import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { eilonwyPrincessOfLlyr } from "./007-eilonwy-princess-of-llyr";

describe("Eilonwy - Princess of Llyr", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [eilonwyPrincessOfLlyr],
    });

    const cardUnderTest = testEngine.getCardModel(eilonwyPrincessOfLlyr);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { eilonwyPrincessOfLlyr } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Eilonwy - Princess of Llyr", () => {
//   it("should be a Support character with correct stats", () => {
//     const testEngine = new TestEngine({
//       play: [eilonwyPrincessOfLlyr],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(eilonwyPrincessOfLlyr);
//
//     // Verify card is in play
//     expect(cardUnderTest.zone).toBe("play");
//
//     // Verify base stats
//     expect(cardUnderTest.lorcanitoCard.cost).toBe(1);
//     expect(cardUnderTest.lorcanitoCard.strength).toBe(2);
//     expect(cardUnderTest.lorcanitoCard.willpower).toBe(1);
//     expect(cardUnderTest.lorcanitoCard.lore).toBe(1);
//
//     // Verify characteristics
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("storyborn");
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("ally");
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("princess");
//
//     // Verify color and inkwell
//     expect(cardUnderTest.lorcanitoCard.colors).toContain("amber");
//     expect(cardUnderTest.lorcanitoCard.inkwell).toBe(true);
//
//     // Verify has Support ability
//     expect(cardUnderTest.lorcanitoCard.abilities).toHaveLength(1);
//   });
//
//   it("should be able to quest for lore", async () => {
//     const testEngine = new TestEngine({
//       play: [eilonwyPrincessOfLlyr],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(eilonwyPrincessOfLlyr);
//
//     const initialLore = testEngine.store.tableStore.getTable("player_one").lore;
//
//     cardUnderTest.quest();
//
//     expect(testEngine.store.tableStore.getTable("player_one").lore).toBe(
//       initialLore + 1,
//     );
//     expect(cardUnderTest.meta.exerted).toBe(true);
//   });
//
//   it("should be playable from hand with correct ink cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: eilonwyPrincessOfLlyr.cost,
//       hand: [eilonwyPrincessOfLlyr],
//     });
//
//     const cardModel = testEngine.getCardModel(eilonwyPrincessOfLlyr);
//
//     expect(cardModel.zone).toBe("hand");
//
//     await testEngine.playCard(eilonwyPrincessOfLlyr);
//
//     expect(cardModel.zone).toBe("play");
//     expect(
//       testEngine.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toBe(0);
//   });
//
//   it("should be able to be used as ink", async () => {
//     const testEngine = new TestEngine({
//       hand: [eilonwyPrincessOfLlyr],
//     });
//
//     const cardModel = testEngine.getCardModel(eilonwyPrincessOfLlyr);
//
//     expect(cardModel.zone).toBe("hand");
//     expect(cardModel.lorcanitoCard.inkwell).toBe(true);
//
//     const initialInkwellSize =
//       testEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//         .length;
//
//     cardModel.addToInkwell();
//
//     expect(cardModel.zone).toBe("inkwell");
//     expect(
//       testEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//         .length,
//     ).toBe(initialInkwellSize + 1);
//   });
//
//   it("should provide Support when questing", async () => {
//     const testEngine = new TestEngine({
//       play: [eilonwyPrincessOfLlyr, arielSpectacularSinger],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(eilonwyPrincessOfLlyr);
//     const target = testEngine.getCardModel(arielSpectacularSinger);
//
//     expect(target.strength).toBe(2);
//
//     cardUnderTest.quest();
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.strength).toBe(4); // 2 + 2 from Eilonwy
//   });
// });
//
