// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DalmatianPuppyTailWagger,
//   PatchPlayfulPup,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Patch - Playful Pup", () => {
//   It("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [patchPlayfulPup],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(patchPlayfulPup);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   It("PUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: dalmatianPuppyTailWagger.cost,
//       Play: [patchPlayfulPup],
//       Hand: [dalmatianPuppyTailWagger],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(patchPlayfulPup);
//
//     // Verify no lore boost
//     Expect(cardUnderTest.lore).toBe(1);
//
//     // Play the other puppy
//     Await testEngine.playCard(dalmatianPuppyTailWagger);
//
//     // Verify lore boost
//     Expect(cardUnderTest.lore).toBe(2);
//   });
// });
//
