// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { sisuEmpoweredSibling } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { tweedleDeeAndTweedleDumStrangeStorytellers } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.", () => {
//   it("should return damaged character", async () => {
//     const testStore = new TestStore({
//       inkwell: 10,
//       play: [tweedleDeeAndTweedleDumStrangeStorytellers, sisuEmpoweredSibling],
//       hand: [letTheStormRageOn],
//     });
//
//     /*expect(testEngine.getCardModel(tweedleDeeAndTweedleDumStrangeStorytellers).getNativeAbilities.length).toEqual(1);
//
//     await testEngine.playCard(
//       letTheStormRageOn,
//       {
//         targets: [sisuEmpoweredSibling],
//       },
//       true,
//     );
//
//     expect(testEngine.getCardModel(sisuEmpoweredSibling).damage).toEqual(2);
//     await testEngine.questCard(tweedleDeeAndTweedleDumStrangeStorytellers);
//
//     expect(testEngine.stackLayers).toHaveLength(1);
//     await testEngine.resolveTopOfStack({ targets: [sisuEmpoweredSibling] });*/
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       tweedleDeeAndTweedleDumStrangeStorytellers.id,
//     );
//     const target = testStore.getByZoneAndId("play", sisuEmpoweredSibling.id);
//
//     target.damage = 2;
//
//     cardUnderTest.quest();
//     testStore.resolveOptionalAbility();
//     expect(testStore.stackLayers).toHaveLength(1);
//
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toBe("hand");
//   });
// });
//
