// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { zeusGodOfLightning } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   heraQueenOfTheGods,
//   herculesBelovedHero,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hera - Queen of the Gods", () => {
//   it("**Ward** _(Opponents can't choose this character except to challenge.)_**PROTECTIVE GODDESS** Your characters named Zeus gain **Ward**.**YOU'RE A TRUE HERO** Your characters named Hercules gain **Evasive**. _(Only characters with Evasive can challenge them.)_", () => {
//     const testStore = new TestStore({
//       play: [heraQueenOfTheGods, zeusGodOfLightning, herculesBelovedHero],
//     });
//
//     const cardUnderTest = testStore.getCard(heraQueenOfTheGods);
//     const zeusCard = testStore.getCard(zeusGodOfLightning);
//     const herculesCard = testStore.getCard(herculesBelovedHero);
//
//     expect(cardUnderTest.hasWard).toBe(true);
//     expect(zeusCard.hasWard).toBe(true);
//     expect(herculesCard.hasEvasive).toBe(true);
//   });
// });
//
