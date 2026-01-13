// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mamaOdieMysticalMaven } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mama Odie - Mystical Maven", () => {
//   it.skip("**THIS GOING TO BE GOOD** Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mamaOdieMysticalMaven.cost,
//       play: [mamaOdieMysticalMaven],
//       hand: [mamaOdieMysticalMaven],
//     });
//
//     await testEngine.playCard(mamaOdieMysticalMaven);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
