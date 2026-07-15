// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   ThumperYoungBunny,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Thumper - Young Bunny", () => {
//   It("YOU CAN DO IT! {E} – Chosen character gets +3 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [thumperYoungBunny, deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(thumperYoungBunny);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "YOU CAN DO IT!",
//       Targets: [target],
//     });
//
//     Expect(target.strength).toBe(deweyLovableShowoff.strength + 3);
//   });
// });
//
