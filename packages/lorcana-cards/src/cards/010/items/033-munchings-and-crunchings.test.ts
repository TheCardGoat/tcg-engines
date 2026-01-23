// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   gurgiAppleLover,
//   mickeyMouseAmberChampion,
//   munchingsAndCrunchings,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Munchings And Crunchings", () => {
//   describe("WHAT A JUICY APPLE - Remove up to 2 damage from chosen character", () => {
//     it("removes exactly 2 damage from a damaged character", () => {
//       const testStore = new TestStore({
//         inkwell: munchingsAndCrunchings.cost + mickeyMouseAmberChampion.cost,
//         hand: [munchingsAndCrunchings, mickeyMouseAmberChampion],
//       });
//
//       const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         munchingsAndCrunchings.id,
//       );
//       const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Play both cards
//       munchingsCard.playFromHand();
//       targetCharacter.playFromHand();
//
//       // Deal 3 damage to the character
//       targetCharacter.updateCardMeta({ damage: 3 });
//       expect(targetCharacter.damage).toBe(3);
//
//       // Activate the healing ability
//       munchingsCard.activate();
//       testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       expect(targetCharacter.damage).toBe(1); // 3 - 2 = 1 damage remaining
//       expect(munchingsCard.meta.exerted).toBe(true);
//     });
//
//     it("removes exactly 1 damage from a character with 1 damage", () => {
//       const testStore = new TestStore({
//         inkwell: munchingsAndCrunchings.cost + mickeyMouseAmberChampion.cost,
//         hand: [munchingsAndCrunchings, mickeyMouseAmberChampion],
//       });
//
//       const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         munchingsAndCrunchings.id,
//       );
//       const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Play both cards
//       munchingsCard.playFromHand();
//       targetCharacter.playFromHand();
//
//       // Deal 1 damage to the character
//       targetCharacter.updateCardMeta({ damage: 1 });
//       expect(targetCharacter.damage).toBe(1);
//
//       // Activate the healing ability
//       munchingsCard.activate();
//       testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       expect(targetCharacter.damage).toBe(0); // All damage removed
//       expect(munchingsCard.meta.exerted).toBe(true);
//     });
//
//     it("does not heal a character with no damage", () => {
//       const testStore = new TestStore({
//         inkwell: munchingsAndCrunchings.cost + mickeyMouseAmberChampion.cost,
//         hand: [munchingsAndCrunchings, mickeyMouseAmberChampion],
//       });
//
//       const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         munchingsAndCrunchings.id,
//       );
//       const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Play both cards
//       munchingsCard.playFromHand();
//       targetCharacter.playFromHand();
//
//       expect(targetCharacter.damage).toBe(0);
//
//       // Activate the healing ability
//       munchingsCard.activate();
//       testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       expect(targetCharacter.damage).toBe(0); // Still no damage
//       expect(munchingsCard.meta.exerted).toBe(true);
//     });
//
//     it("can heal any character in play", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: munchingsAndCrunchings.cost,
//           hand: [munchingsAndCrunchings],
//         },
//         {
//           inkwell: mickeyMouseAmberChampion.cost,
//           hand: [mickeyMouseAmberChampion],
//         },
//       );
//
//       const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         munchingsAndCrunchings.id,
//       );
//
//       // Play Munchings And Crunchings
//       munchingsCard.playFromHand();
//
//       // Opponent plays their character
//       const opponentCharacter = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//         "player_two",
//       );
//       opponentCharacter.playFromHand();
//
//       // Deal damage to opponent's character
//       opponentCharacter.updateCardMeta({ damage: 2 });
//       expect(opponentCharacter.damage).toBe(2);
//
//       // Activate the healing ability on opponent's character
//       munchingsCard.activate();
//       testStore.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       expect(opponentCharacter.damage).toBe(0); // All damage removed
//       expect(munchingsCard.meta.exerted).toBe(true);
//     });
//
//     it("exerts the card when activated", () => {
//       const testStore = new TestStore({
//         play: [munchingsAndCrunchings, mickeyMouseAmberChampion],
//       });
//
//       const munchingsCard = testStore.getByZoneAndId(
//         "play",
//         munchingsAndCrunchings.id,
//       );
//       const targetCharacter = testStore.getByZoneAndId(
//         "play",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Deal 1 damage to the character
//       targetCharacter.updateCardMeta({ damage: 1 });
//       expect(targetCharacter.damage).toBe(1);
//
//       // Activate the healing ability
//       munchingsCard.activate();
//       testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       expect(targetCharacter.damage).toBe(0); // All damage removed
//       expect(munchingsCard.meta.exerted).toBe(true);
//     });
//   });
//
//   describe("COME ON OUT - You pay 1 {I} less to play characters named Gurgi", () => {
//     it("reduces Gurgi's cost by 1 ink when Munchings And Crunchings is in play", () => {
//       const testStore = new TestStore({
//         inkwell: gurgiAppleLover.cost - 1, // 1 ink (Gurgi normally costs 2)
//         play: [munchingsAndCrunchings],
//         hand: [gurgiAppleLover],
//       });
//
//       const gurgiCard = testStore.getByZoneAndId("hand", gurgiAppleLover.id);
//
//       // With Munchings And Crunchings in play, Gurgi should cost 1 ink
//       expect(gurgiCard.cost).toBe(1);
//
//       // Player should be able to play Gurgi with only 1 ink available
//       gurgiCard.playFromHand();
//
//       expect(gurgiCard.zone).toBe("play");
//       expect(testStore.store.tableStore.getTable().inkAvailable()).toBe(0);
//     });
//
//     it("Gurgi costs normal 2 ink without Munchings And Crunchings", () => {
//       const testStore = new TestStore({
//         inkwell: gurgiAppleLover.cost - 1, // 1 ink
//         hand: [gurgiAppleLover],
//       });
//
//       const gurgiCard = testStore.getByZoneAndId("hand", gurgiAppleLover.id);
//
//       // Without Munchings And Crunchings, Gurgi costs 2 ink
//       expect(gurgiCard.cost).toBe(2);
//
//       // Cannot play with only 1 ink
//       gurgiCard.playFromHand();
//
//       expect(gurgiCard.zone).toBe("hand");
//     });
//
//     it("does not affect other characters' costs", () => {
//       const testStore = new TestStore({
//         inkwell: mickeyMouseAmberChampion.cost - 1, // 1 ink
//         play: [munchingsAndCrunchings],
//         hand: [mickeyMouseAmberChampion],
//       });
//
//       const mickeyCard = testStore.getByZoneAndId(
//         "hand",
//         mickeyMouseAmberChampion.id,
//       );
//
//       // Other characters should not be affected by the cost reduction
//       expect(mickeyCard.cost).toBe(mickeyMouseAmberChampion.cost);
//
//       // Cannot play with insufficient ink
//       mickeyCard.playFromHand();
//
//       expect(mickeyCard.zone).toBe("hand");
//     });
//
//     it("cost reduction only applies while Munchings And Crunchings is in play", () => {
//       const testStore = new TestStore({
//         inkwell: gurgiAppleLover.cost,
//         hand: [munchingsAndCrunchings, gurgiAppleLover],
//       });
//
//       const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         munchingsAndCrunchings.id,
//       );
//       const gurgiCard = testStore.getByZoneAndId("hand", gurgiAppleLover.id);
//
//       // Gurgi costs 2 ink initially
//       expect(gurgiCard.cost).toBe(2);
//
//       // Play Munchings And Crunchings
//       munchingsCard.playFromHand();
//
//       // Now Gurgi costs 1 ink
//       expect(gurgiCard.cost).toBe(1);
//     });
//   });
// });
//
