// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   MickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { magicalManeuvers } from "@lorcanito/lorcana-engine/cards/007";
// Import { mickeyMouseBraveLittlePrince } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Magical Maneuvers", () => {
//   It("Return chosen character of yours to your hand. Exert chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: magicalManeuvers.cost,
//         Hand: [magicalManeuvers],
//         Play: [arielSpectacularSinger],
//       },
//       {
//         Play: [mickeyBraveLittleTailor, mickeyMouseBraveLittlePrince],
//       },
//     );
//
//     Await testEngine.playCard(magicalManeuvers);
//
//     // First effect: Return your character to hand
//     Await testEngine.resolveTopOfStack(
//       { targets: [arielSpectacularSinger] },
//       True,
//     );
//     Expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe("hand");
//
//     // Second effect: Exert any character
//     Await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).exerted).toBe(true);
//   });
// });
//
