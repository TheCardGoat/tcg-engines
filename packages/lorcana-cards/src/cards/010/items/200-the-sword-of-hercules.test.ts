// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { boltSuperdog } from "@lorcanito/lorcana-engine/cards/007";
// // Import some Deity characters for testing
// import {
//   hadesLookingForADeal,
//   herculesMightyLeader,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { theSwordOfHercules } from "./200-the-sword-of-hercules.ts";
//
// describe("The Sword of Hercules", () => {
//   describe("MIGHTY HIT ability", () => {
//     it("banishes chosen opposing Deity character when played", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theSwordOfHercules.cost,
//           hand: [theSwordOfHercules],
//         },
//         {
//           play: [hadesLookingForADeal],
//         },
//       );
//
//       // Play The Sword of Hercules
//       await testEngine.playCard(theSwordOfHercules);
//
//       // Should trigger MIGHTY HIT ability - we need to provide the target
//       const hadesTarget = testEngine.getCardModel(hadesLookingForADeal);
//       await testEngine.resolveTopOfStack({ targets: [hadesTarget] }, true);
//
//       // Hades should be banished (check opponent's play area)
//       expect(hadesTarget.isBanished).toBe(true);
//     });
//   });
//
//   describe("HAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.", () => {
//     it("gains 1 lore when your character banishes another character in a challenge during your turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 6,
//           play: [herculesMightyLeader, theSwordOfHercules],
//         },
//         {
//           play: [boltSuperdog],
//         },
//       );
//
//       await testEngine.exertCard(boltSuperdog);
//       const startingLore = testEngine.getLoreForPlayer();
//
//       // Challenge and banish the opponent's character
//       await testEngine.challenge({
//         attacker: herculesMightyLeader,
//         defender: boltSuperdog,
//       });
//
//       // Should gain 1 lore from HAND-TO-HAND ability
//       expect(testEngine.getLoreForPlayer()).toBe(startingLore + 1);
//     });
//   });
// });
//
