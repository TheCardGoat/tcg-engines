// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { zeusGodOfLightning } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   HeraQueenOfTheGods,
//   HerculesBelovedHero,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hera - Queen of the Gods", () => {
//   It("**Ward** _(Opponents can't choose this character except to challenge.)_**PROTECTIVE GODDESS** Your characters named Zeus gain **Ward**.**YOU'RE A TRUE HERO** Your characters named Hercules gain **Evasive**. _(Only characters with Evasive can challenge them.)_", () => {
//     Const testStore = new TestStore({
//       Play: [heraQueenOfTheGods, zeusGodOfLightning, herculesBelovedHero],
//     });
//
//     Const cardUnderTest = testStore.getCard(heraQueenOfTheGods);
//     Const zeusCard = testStore.getCard(zeusGodOfLightning);
//     Const herculesCard = testStore.getCard(herculesBelovedHero);
//
//     Expect(cardUnderTest.hasWard).toBe(true);
//     Expect(zeusCard.hasWard).toBe(true);
//     Expect(herculesCard.hasEvasive).toBe(true);
//   });
// });
//
