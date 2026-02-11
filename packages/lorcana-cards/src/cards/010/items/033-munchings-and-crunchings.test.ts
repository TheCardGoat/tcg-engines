// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GurgiAppleLover,
//   MickeyMouseAmberChampion,
//   MunchingsAndCrunchings,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Munchings And Crunchings", () => {
//   Describe("WHAT A JUICY APPLE - Remove up to 2 damage from chosen character", () => {
//     It("removes exactly 2 damage from a damaged character", () => {
//       Const testStore = new TestStore({
//         Inkwell: munchingsAndCrunchings.cost + mickeyMouseAmberChampion.cost,
//         Hand: [munchingsAndCrunchings, mickeyMouseAmberChampion],
//       });
//
//       Const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         MunchingsAndCrunchings.id,
//       );
//       Const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Play both cards
//       MunchingsCard.playFromHand();
//       TargetCharacter.playFromHand();
//
//       // Deal 3 damage to the character
//       TargetCharacter.updateCardMeta({ damage: 3 });
//       Expect(targetCharacter.damage).toBe(3);
//
//       // Activate the healing ability
//       MunchingsCard.activate();
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       Expect(targetCharacter.damage).toBe(1); // 3 - 2 = 1 damage remaining
//       Expect(munchingsCard.meta.exerted).toBe(true);
//     });
//
//     It("removes exactly 1 damage from a character with 1 damage", () => {
//       Const testStore = new TestStore({
//         Inkwell: munchingsAndCrunchings.cost + mickeyMouseAmberChampion.cost,
//         Hand: [munchingsAndCrunchings, mickeyMouseAmberChampion],
//       });
//
//       Const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         MunchingsAndCrunchings.id,
//       );
//       Const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Play both cards
//       MunchingsCard.playFromHand();
//       TargetCharacter.playFromHand();
//
//       // Deal 1 damage to the character
//       TargetCharacter.updateCardMeta({ damage: 1 });
//       Expect(targetCharacter.damage).toBe(1);
//
//       // Activate the healing ability
//       MunchingsCard.activate();
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       Expect(targetCharacter.damage).toBe(0); // All damage removed
//       Expect(munchingsCard.meta.exerted).toBe(true);
//     });
//
//     It("does not heal a character with no damage", () => {
//       Const testStore = new TestStore({
//         Inkwell: munchingsAndCrunchings.cost + mickeyMouseAmberChampion.cost,
//         Hand: [munchingsAndCrunchings, mickeyMouseAmberChampion],
//       });
//
//       Const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         MunchingsAndCrunchings.id,
//       );
//       Const targetCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Play both cards
//       MunchingsCard.playFromHand();
//       TargetCharacter.playFromHand();
//
//       Expect(targetCharacter.damage).toBe(0);
//
//       // Activate the healing ability
//       MunchingsCard.activate();
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       Expect(targetCharacter.damage).toBe(0); // Still no damage
//       Expect(munchingsCard.meta.exerted).toBe(true);
//     });
//
//     It("can heal any character in play", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: munchingsAndCrunchings.cost,
//           Hand: [munchingsAndCrunchings],
//         },
//         {
//           Inkwell: mickeyMouseAmberChampion.cost,
//           Hand: [mickeyMouseAmberChampion],
//         },
//       );
//
//       Const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         MunchingsAndCrunchings.id,
//       );
//
//       // Play Munchings And Crunchings
//       MunchingsCard.playFromHand();
//
//       // Opponent plays their character
//       Const opponentCharacter = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//         "player_two",
//       );
//       OpponentCharacter.playFromHand();
//
//       // Deal damage to opponent's character
//       OpponentCharacter.updateCardMeta({ damage: 2 });
//       Expect(opponentCharacter.damage).toBe(2);
//
//       // Activate the healing ability on opponent's character
//       MunchingsCard.activate();
//       TestStore.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       Expect(opponentCharacter.damage).toBe(0); // All damage removed
//       Expect(munchingsCard.meta.exerted).toBe(true);
//     });
//
//     It("exerts the card when activated", () => {
//       Const testStore = new TestStore({
//         Play: [munchingsAndCrunchings, mickeyMouseAmberChampion],
//       });
//
//       Const munchingsCard = testStore.getByZoneAndId(
//         "play",
//         MunchingsAndCrunchings.id,
//       );
//       Const targetCharacter = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Deal 1 damage to the character
//       TargetCharacter.updateCardMeta({ damage: 1 });
//       Expect(targetCharacter.damage).toBe(1);
//
//       // Activate the healing ability
//       MunchingsCard.activate();
//       TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//       Expect(targetCharacter.damage).toBe(0); // All damage removed
//       Expect(munchingsCard.meta.exerted).toBe(true);
//     });
//   });
//
//   Describe("COME ON OUT - You pay 1 {I} less to play characters named Gurgi", () => {
//     It("reduces Gurgi's cost by 1 ink when Munchings And Crunchings is in play", () => {
//       Const testStore = new TestStore({
//         Inkwell: gurgiAppleLover.cost - 1, // 1 ink (Gurgi normally costs 2)
//         Play: [munchingsAndCrunchings],
//         Hand: [gurgiAppleLover],
//       });
//
//       Const gurgiCard = testStore.getByZoneAndId("hand", gurgiAppleLover.id);
//
//       // With Munchings And Crunchings in play, Gurgi should cost 1 ink
//       Expect(gurgiCard.cost).toBe(1);
//
//       // Player should be able to play Gurgi with only 1 ink available
//       GurgiCard.playFromHand();
//
//       Expect(gurgiCard.zone).toBe("play");
//       Expect(testStore.store.tableStore.getTable().inkAvailable()).toBe(0);
//     });
//
//     It("Gurgi costs normal 2 ink without Munchings And Crunchings", () => {
//       Const testStore = new TestStore({
//         Inkwell: gurgiAppleLover.cost - 1, // 1 ink
//         Hand: [gurgiAppleLover],
//       });
//
//       Const gurgiCard = testStore.getByZoneAndId("hand", gurgiAppleLover.id);
//
//       // Without Munchings And Crunchings, Gurgi costs 2 ink
//       Expect(gurgiCard.cost).toBe(2);
//
//       // Cannot play with only 1 ink
//       GurgiCard.playFromHand();
//
//       Expect(gurgiCard.zone).toBe("hand");
//     });
//
//     It("does not affect other characters' costs", () => {
//       Const testStore = new TestStore({
//         Inkwell: mickeyMouseAmberChampion.cost - 1, // 1 ink
//         Play: [munchingsAndCrunchings],
//         Hand: [mickeyMouseAmberChampion],
//       });
//
//       Const mickeyCard = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseAmberChampion.id,
//       );
//
//       // Other characters should not be affected by the cost reduction
//       Expect(mickeyCard.cost).toBe(mickeyMouseAmberChampion.cost);
//
//       // Cannot play with insufficient ink
//       MickeyCard.playFromHand();
//
//       Expect(mickeyCard.zone).toBe("hand");
//     });
//
//     It("cost reduction only applies while Munchings And Crunchings is in play", () => {
//       Const testStore = new TestStore({
//         Inkwell: gurgiAppleLover.cost,
//         Hand: [munchingsAndCrunchings, gurgiAppleLover],
//       });
//
//       Const munchingsCard = testStore.getByZoneAndId(
//         "hand",
//         MunchingsAndCrunchings.id,
//       );
//       Const gurgiCard = testStore.getByZoneAndId("hand", gurgiAppleLover.id);
//
//       // Gurgi costs 2 ink initially
//       Expect(gurgiCard.cost).toBe(2);
//
//       // Play Munchings And Crunchings
//       MunchingsCard.playFromHand();
//
//       // Now Gurgi costs 1 ink
//       Expect(gurgiCard.cost).toBe(1);
//     });
//   });
// });
//
