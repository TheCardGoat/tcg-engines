// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AmethystCoil,
//   EmeraldCoil,
//   ScroogeMcduckResourcefulMiser,
//   SpaghettiDinner,
//   TheGlassSlipper,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scrooge Mcduck - Resourceful Miser", () => {
//   Const items = [spaghettiDinner, emeraldCoil, theGlassSlipper, amethystCoil];
//   It("PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 0,
//       Play: items,
//       Hand: [scroogeMcduckResourcefulMiser],
//     });
//
//     Await testEngine.playCard(scroogeMcduckResourcefulMiser, {
//       AlternativeCosts: items,
//     });
//
//     Expect(testEngine.getCardModel(scroogeMcduckResourcefulMiser).zone).toBe(
//       "play",
//     );
//
//     For (const item of items) {
//       Expect(testEngine.getCardModel(item).exerted).toBe(true);
//     }
//   });
//
//   It("FORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: scroogeMcduckResourcefulMiser.cost,
//       Hand: [scroogeMcduckResourcefulMiser],
//       Deck: items,
//     });
//
//     Await testEngine.playCard(scroogeMcduckResourcefulMiser, {
//       Scry: {
//         Hand: [theGlassSlipper],
//         Bottom: [spaghettiDinner, emeraldCoil, amethystCoil],
//       },
//     });
//
//     Expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("hand");
//   });
// });
//
