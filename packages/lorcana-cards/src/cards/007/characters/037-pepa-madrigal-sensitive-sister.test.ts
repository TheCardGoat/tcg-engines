// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HesATramp,
//   PepaMadrigalSensitiveSister,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pepa Madrigal - Sensitive Sister", () => {
//   Describe("CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.", () => {
//     It("Singing a song", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: pepaMadrigalSensitiveSister.cost,
//         Play: [pepaMadrigalSensitiveSister],
//         Hand: [hesATramp],
//       });
//
//       Await testEngine.singSong({
//         Singer: pepaMadrigalSensitiveSister,
//         Song: hesATramp,
//       });
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getLoreForPlayer()).toBe(1);
//     });
//
//     It("Casting a song", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: pepaMadrigalSensitiveSister.cost,
//         Play: [pepaMadrigalSensitiveSister],
//         Hand: [hesATramp],
//       });
//
//       Await testEngine.playCard(hesATramp);
//
//       Expect(testEngine.getLoreForPlayer()).toBe(0);
//     });
//   });
// });
//
