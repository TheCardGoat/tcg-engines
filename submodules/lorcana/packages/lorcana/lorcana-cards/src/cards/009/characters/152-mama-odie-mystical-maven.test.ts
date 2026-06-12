// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mamaOdieMysticalMaven } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mama Odie - Mystical Maven", () => {
//   It.skip("**THIS GOING TO BE GOOD** Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mamaOdieMysticalMaven.cost,
//       Play: [mamaOdieMysticalMaven],
//       Hand: [mamaOdieMysticalMaven],
//     });
//
//     Await testEngine.playCard(mamaOdieMysticalMaven);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
