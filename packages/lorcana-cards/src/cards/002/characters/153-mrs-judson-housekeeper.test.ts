// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   HerculesDivineHero,
//   MrsJudsonHousekeeper,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mrs. Judson - Housekeeper", () => {
//   It("**TIDY UP** Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: herculesDivineHero.cost,
//       Hand: [herculesDivineHero],
//       Play: [mrsJudsonHousekeeper],
//       Deck: [liloGalacticHero],
//     });
//
//     Const floodbornChar = testStore.getByZoneAndId(
//       "hand",
//       HerculesDivineHero.id,
//     );
//     Const target = testStore.getByZoneAndId("deck", liloGalacticHero.id);
//
//     FloodbornChar.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     Expect(target.zone).toEqual("inkwell");
//     Expect(target.ready).toEqual(false);
//   });
// });
//
