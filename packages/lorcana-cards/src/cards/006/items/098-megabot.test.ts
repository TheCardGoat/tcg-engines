// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { megabot } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Megabot", () => {
//   It.skip("HAPPY FACE This item enters play exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: megabot.cost,
//       Play: [megabot],
//       Hand: [megabot],
//     });
//
//     Await testEngine.playCard(megabot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("DESTROY! {E}, Banish this item - Choose one:", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: megabot.cost,
//       Play: [megabot],
//       Hand: [megabot],
//     });
//
//     Await testEngine.playCard(megabot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("* Banish chosen item.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: megabot.cost,
//       Play: [megabot],
//       Hand: [megabot],
//     });
//
//     Await testEngine.playCard(megabot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("* Banish chosen damaged character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: megabot.cost,
//       Play: [megabot],
//       Hand: [megabot],
//     });
//
//     Await testEngine.playCard(megabot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
