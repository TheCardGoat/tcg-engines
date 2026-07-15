// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { princePhillipSwordsmanOfTheRealm } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince Phillip - Swordsman of the Realm", () => {
//   It.skip("**SLAYER OF DRAGONS** When you play this character, banish chosen opposing Dragon character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: princePhillipSwordsmanOfTheRealm.cost,
//       Hand: [princePhillipSwordsmanOfTheRealm],
//     });
//
//     Const cardUnderTest = testStore.getCard(princePhillipSwordsmanOfTheRealm);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**PRESSING THE ADVANTAGE** When he challenges a damaged character, ready this character after the challenge.", () => {
//     Const testStore = new TestStore({
//       Inkwell: princePhillipSwordsmanOfTheRealm.cost,
//       Play: [princePhillipSwordsmanOfTheRealm],
//     });
//
//     Const cardUnderTest = testStore.getCard(princePhillipSwordsmanOfTheRealm);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
