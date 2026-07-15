// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { boltSuperdog } from "@lorcanito/lorcana-engine/cards/007";
// // Import some Deity characters for testing
// Import {
//   HadesLookingForADeal,
//   HerculesMightyLeader,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { theSwordOfHercules } from "./200-the-sword-of-hercules.ts";
//
// Describe("The Sword of Hercules", () => {
//   Describe("MIGHTY HIT ability", () => {
//     It("banishes chosen opposing Deity character when played", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theSwordOfHercules.cost,
//           Hand: [theSwordOfHercules],
//         },
//         {
//           Play: [hadesLookingForADeal],
//         },
//       );
//
//       // Play The Sword of Hercules
//       Await testEngine.playCard(theSwordOfHercules);
//
//       // Should trigger MIGHTY HIT ability - we need to provide the target
//       Const hadesTarget = testEngine.getCardModel(hadesLookingForADeal);
//       Await testEngine.resolveTopOfStack({ targets: [hadesTarget] }, true);
//
//       // Hades should be banished (check opponent's play area)
//       Expect(hadesTarget.isBanished).toBe(true);
//     });
//   });
//
//   Describe("HAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.", () => {
//     It("gains 1 lore when your character banishes another character in a challenge during your turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 6,
//           Play: [herculesMightyLeader, theSwordOfHercules],
//         },
//         {
//           Play: [boltSuperdog],
//         },
//       );
//
//       Await testEngine.exertCard(boltSuperdog);
//       Const startingLore = testEngine.getLoreForPlayer();
//
//       // Challenge and banish the opponent's character
//       Await testEngine.challenge({
//         Attacker: herculesMightyLeader,
//         Defender: boltSuperdog,
//       });
//
//       // Should gain 1 lore from HAND-TO-HAND ability
//       Expect(testEngine.getLoreForPlayer()).toBe(startingLore + 1);
//     });
//   });
// });
//
