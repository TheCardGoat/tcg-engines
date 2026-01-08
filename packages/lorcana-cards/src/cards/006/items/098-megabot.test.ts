// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { megabot } from "@lorcanito/lorcana-engine/cards/006/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Megabot", () => {
//   it.skip("HAPPY FACE This item enters play exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: megabot.cost,
//       play: [megabot],
//       hand: [megabot],
//     });
//
//     await testEngine.playCard(megabot);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("DESTROY! {E}, Banish this item - Choose one:", async () => {
//     const testEngine = new TestEngine({
//       inkwell: megabot.cost,
//       play: [megabot],
//       hand: [megabot],
//     });
//
//     await testEngine.playCard(megabot);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("* Banish chosen item.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: megabot.cost,
//       play: [megabot],
//       hand: [megabot],
//     });
//
//     await testEngine.playCard(megabot);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("* Banish chosen damaged character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: megabot.cost,
//       play: [megabot],
//       hand: [megabot],
//     });
//
//     await testEngine.playCard(megabot);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
