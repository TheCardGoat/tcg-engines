// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { doloresMadrigalEasyListener } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dolores Madrigal - Easy Listener", () => {
//   It.skip("**MAGICAL INFORMANT** When you play this character, if an opponent has an exerted character in play, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: doloresMadrigalEasyListener.cost,
//       Hand: [doloresMadrigalEasyListener],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       DoloresMadrigalEasyListener.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
