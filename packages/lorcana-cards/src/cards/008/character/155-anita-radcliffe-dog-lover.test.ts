// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnitaRadcliffeDogLover,
//   PatchPlayfulPup,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Anita Radcliffe - Dog Lover", () => {
//   It("I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: anitaRadcliffeDogLover.cost,
//       Hand: [anitaRadcliffeDogLover],
//       Play: [patchPlayfulPup],
//     });
//
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasResist).toBe(false);
//
//     Await testEngine.playCard(anitaRadcliffeDogLover);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [patchPlayfulPup] });
//
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasResist).toBe(true);
//     TestEngine.passTurn();
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasResist).toBe(true);
//     TestEngine.passTurn();
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasResist).toBe(false);
//   });
// });
//
