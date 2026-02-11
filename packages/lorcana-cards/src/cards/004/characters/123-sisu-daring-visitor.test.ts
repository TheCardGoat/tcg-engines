// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { rafikiMysticalFighter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { sisuDaringVisitor } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sisu - Daring Visitor", () => {
//   It("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Play: [sisuDaringVisitor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       SisuDaringVisitor.id,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("**BRING ON THE HEAT!** When you play this character, banish chosen opposing character with 1 {S} or less.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: sisuDaringVisitor.cost,
//         Hand: [sisuDaringVisitor],
//       },
//       {
//         Play: [rafikiMysticalFighter],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(sisuDaringVisitor);
//     Const target = testStore.getCard(rafikiMysticalFighter);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
// });
//
