// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { plasmaBlaster } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   HesATramp,
//   JohnSilverVengefulPirate,
//   WeveGotCompany,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("John Silver - Vengeful Pirate", () => {
//   Describe("DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.", () => {
//     It("Doesn't not reduce the cost if there's no damage", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: johnSilverVengefulPirate.cost - 2,
//           Play: [plasmaBlaster],
//           Hand: [johnSilverVengefulPirate],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(johnSilverVengefulPirate);
//
//       Await testEngine.playCard(johnSilverVengefulPirate);
//
//       Expect(cardUnderTest.cost).toBe(johnSilverVengefulPirate.cost);
//       Expect(cardUnderTest.zone).toBe("hand");
//     });
//
//     It("reduces the cost when opponent's char is damaged", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: johnSilverVengefulPirate.cost,
//           Play: [plasmaBlaster],
//           Hand: [johnSilverVengefulPirate],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(johnSilverVengefulPirate);
//
//       Expect(cardUnderTest.cost).toBe(johnSilverVengefulPirate.cost);
//
//       Await testEngine.activateCard(plasmaBlaster, {
//         Targets: [goofyKnightForADay],
//       });
//
//       Await testEngine.playCard(johnSilverVengefulPirate);
//       Expect(cardUnderTest.cost).toBe(johnSilverVengefulPirate.cost - 2);
//
//       Await testEngine.playCard(johnSilverVengefulPirate);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
//
//   It("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [johnSilverVengefulPirate],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(johnSilverVengefulPirate);
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
//
//   Describe("I AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.", () => {
//     It("deals 1 damage to chosen character when playing a action not song", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: johnSilverVengefulPirate.cost,
//           Play: [johnSilverVengefulPirate],
//           Hand: [weveGotCompany],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Await testEngine.playCard(weveGotCompany);
//
//       Await testEngine.resolveOptionalAbility(true);
//       Await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//
//       Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1);
//     });
//
//     It("does NOT deal 1 damage to chosen character when playing a  song", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: johnSilverVengefulPirate.cost,
//           Play: [johnSilverVengefulPirate],
//           Hand: [hesATramp],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Await testEngine.playCard(hesATramp, {
//         Targets: [johnSilverVengefulPirate],
//       });
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
