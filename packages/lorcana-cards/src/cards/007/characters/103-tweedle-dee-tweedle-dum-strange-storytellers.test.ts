// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { sisuEmpoweredSibling } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { tweedleDeeAndTweedleDumStrangeStorytellers } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.", () => {
//   It("should return damaged character", async () => {
//     Const testStore = new TestStore({
//       Inkwell: 10,
//       Play: [tweedleDeeAndTweedleDumStrangeStorytellers, sisuEmpoweredSibling],
//       Hand: [letTheStormRageOn],
//     });
//
//     /*expect(testEngine.getCardModel(tweedleDeeAndTweedleDumStrangeStorytellers).getNativeAbilities.length).toEqual(1);
//
//     Await testEngine.playCard(
//       LetTheStormRageOn,
//       {
//         Targets: [sisuEmpoweredSibling],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(sisuEmpoweredSibling).damage).toEqual(2);
//     Await testEngine.questCard(tweedleDeeAndTweedleDumStrangeStorytellers);
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveTopOfStack({ targets: [sisuEmpoweredSibling] });*/
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TweedleDeeAndTweedleDumStrangeStorytellers.id,
//     );
//     Const target = testStore.getByZoneAndId("play", sisuEmpoweredSibling.id);
//
//     Target.damage = 2;
//
//     CardUnderTest.quest();
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.stackLayers).toHaveLength(1);
//
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("hand");
//   });
// });
//
