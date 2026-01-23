// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { rafikiMysticalFighter } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Rafiki - Mystical Fighter", () => {
//   it.skip("**Challenger** +3 _(While challenging, this character gets +3 {S}.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [rafikiMysticalFighter],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(rafikiMysticalFighter);
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
//
//   it.skip("**ANCIENT SKILLS** Whenever he challenges a Hyena character, this character takes no damage from the challenge.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: rafikiMysticalFighter.cost,
//       play: [rafikiMysticalFighter],
//       hand: [rafikiMysticalFighter],
//     });
//
//     await testEngine.playCard(rafikiMysticalFighter);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
