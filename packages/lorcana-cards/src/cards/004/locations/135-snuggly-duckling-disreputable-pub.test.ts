// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HadesMeticulousPlotter,
//   SisuWiseFriend,
//   TongSurvivor,
//   TukTukCuriousPartner,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { snugglyDucklingDisreputablePub } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Snuggly Duckling - Disreputable Pub", () => {
//   Describe("**ROUTINE RUCKUS** Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.", () => {
//     It("should not gain lore when a character with 2 {S} challenges another character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: snugglyDucklingDisreputablePub.moveCost,
//           Play: [snugglyDucklingDisreputablePub, tukTukCuriousPartner],
//         },
//         {
//           Play: [hadesMeticulousPlotter],
//         },
//       );
//
//       Await testEngine.tapCard(hadesMeticulousPlotter);
//       Await testEngine.moveToLocation({
//         Location: snugglyDucklingDisreputablePub,
//         Character: tukTukCuriousPartner,
//       });
//
//       Await testEngine.challenge({
//         Attacker: tukTukCuriousPartner,
//         Defender: hadesMeticulousPlotter,
//       });
//
//       Expect(testEngine.getPlayerLore()).toBe(0);
//     });
//
//     It("should gain 1 lore when a character with 3 {S} challenges another character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: snugglyDucklingDisreputablePub.moveCost,
//           Play: [snugglyDucklingDisreputablePub, tongSurvivor],
//         },
//         {
//           Play: [hadesMeticulousPlotter],
//         },
//       );
//
//       Await testEngine.tapCard(hadesMeticulousPlotter);
//       Await testEngine.moveToLocation({
//         Location: snugglyDucklingDisreputablePub,
//         Character: tongSurvivor,
//       });
//
//       Await testEngine.challenge({
//         Attacker: tongSurvivor,
//         Defender: hadesMeticulousPlotter,
//       });
//
//       Expect(testEngine.getPlayerLore()).toBe(1);
//     });
//
//     It("should gain 3 lore when a character with 6 {S} challenges another character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: snugglyDucklingDisreputablePub.moveCost,
//           Play: [snugglyDucklingDisreputablePub, sisuWiseFriend],
//         },
//         {
//           Play: [hadesMeticulousPlotter],
//         },
//       );
//
//       Await testEngine.tapCard(hadesMeticulousPlotter);
//       Await testEngine.moveToLocation({
//         Location: snugglyDucklingDisreputablePub,
//         Character: sisuWiseFriend,
//       });
//
//       Await testEngine.challenge({
//         Attacker: sisuWiseFriend,
//         Defender: hadesMeticulousPlotter,
//       });
//
//       Expect(testEngine.getPlayerLore()).toBe(3);
//     });
//   });
// });
//
