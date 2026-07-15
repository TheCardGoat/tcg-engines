// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { rafikiMysticalFighter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { shenziHeadHyena } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rafiki - Mystical Fighter", () => {
//   It("**Challenger** +3 _(While challenging, this character gets +3 {S}.)_**ANCIENT SKILLS** Whenever he challenges a Hyena character, this character takes no damage from the challenge.", () => {
//     Const testStore = new TestStore({
//       Play: [rafikiMysticalFighter],
//     });
//
//     Const cardUnderTest = testStore.getCard(rafikiMysticalFighter);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
//
//   It("Ancient Skills - Whenever he challenges a Hyena character, this character takes no damage from the challenge.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [rafikiMysticalFighter],
//       },
//       {
//         Play: [shenziHeadHyena],
//       },
//     );
//
//     Await testEngine.tapCard(shenziHeadHyena);
//
//     Const { attacker, defender } = await testEngine.challenge({
//       Attacker: rafikiMysticalFighter,
//       Defender: shenziHeadHyena,
//     });
//
//     Expect(defender.damage).toBe(3);
//     Expect(attacker.damage).toBe(0);
//     Expect(attacker.isDead).toBe(false);
//   });
// });
//
// Describe("Regression", () => {
//   It("can challenge a character with no damage", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [rafikiMysticalFighter],
//       },
//       {
//         Play: [magicBroomBucketBrigade],
//       },
//     );
//
//     Await testEngine.tapCard(magicBroomBucketBrigade);
//
//     Const { attacker, defender } = await testEngine.challenge({
//       Attacker: rafikiMysticalFighter,
//       Defender: magicBroomBucketBrigade,
//     });
//
//     Expect(defender.isDead).toBe(true);
//   });
// });
//
