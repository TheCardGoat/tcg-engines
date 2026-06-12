// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { rafikiMysticalFighter } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rafiki - Mystical Fighter", () => {
//   It.skip("**Challenger** +3 _(While challenging, this character gets +3 {S}.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [rafikiMysticalFighter],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rafikiMysticalFighter);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
//
//   It.skip("**ANCIENT SKILLS** Whenever he challenges a Hyena character, this character takes no damage from the challenge.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rafikiMysticalFighter.cost,
//       Play: [rafikiMysticalFighter],
//       Hand: [rafikiMysticalFighter],
//     });
//
//     Await testEngine.playCard(rafikiMysticalFighter);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
