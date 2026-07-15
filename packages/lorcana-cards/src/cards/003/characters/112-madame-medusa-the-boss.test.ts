// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MadameMedusaTheBoss,
//   WebbyVanderquackEnthusiasticDuck,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Madame Medusa - The Boss", () => {
//   It("**THAT TERRIBLE WOMAN** When you play this character, banish chosen opposing character with 3 {S} or less.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: madameMedusaTheBoss.cost,
//         Hand: [madameMedusaTheBoss],
//       },
//       {
//         Play: [webbyVanderquackEnthusiasticDuck],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MadameMedusaTheBoss.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       WebbyVanderquackEnthusiasticDuck.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
