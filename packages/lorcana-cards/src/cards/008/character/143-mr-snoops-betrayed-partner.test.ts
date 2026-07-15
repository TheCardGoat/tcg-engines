// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { mrSnoopsBetrayedPartner } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mr. Snoops - Betrayed Partner", () => {
//   Describe("DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.", () => {
//     It("Your turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: dragonFire.cost,
//         Play: [mrSnoopsBetrayedPartner],
//         Hand: [dragonFire],
//         Deck: 10,
//       });
//
//       Await testEngine.playCard(
//         DragonFire,
//         {
//           Targets: [mrSnoopsBetrayedPartner],
//         },
//         True,
//       );
//
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 9,
//           Hand: 1,
//         }),
//       );
//     });
//
//     It("Opponent's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: dragonFire.cost,
//           Hand: [dragonFire],
//         },
//         {
//           Play: [mrSnoopsBetrayedPartner],
//           Deck: 10,
//         },
//       );
//
//       Await testEngine.playCard(
//         DragonFire,
//         {
//           Targets: [mrSnoopsBetrayedPartner],
//         },
//         True,
//       );
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
