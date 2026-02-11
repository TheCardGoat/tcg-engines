// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   MushuFasttalkingDragon,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mushu - Fast-Talking Dragon", () => {
//   It("LET’S GET THIS SHOW ON THE ROAD {E} – Chosen character gains Rush this turn. (They can challenge the turn they're played.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mushuFasttalkingDragon, deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mushuFasttalkingDragon);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Targets: [target],
//     });
//
//     Expect(target.hasRush).toBe(true);
//   });
// });
//
