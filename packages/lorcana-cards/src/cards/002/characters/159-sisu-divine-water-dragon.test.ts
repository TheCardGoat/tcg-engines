// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   MauiDemiGod,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   GoofyKnightForADay,
//   SisuDivineWaterDragon,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sisu - Divine Water Dragon", () => {
//   It("**I TRUST YOU** Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Play: [sisuDivineWaterDragon],
//       Deck: [liloGalacticHero, goofyKnightForADay, mauiDemiGod],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       SisuDivineWaterDragon.id,
//     );
//     Const top = testStore.getByZoneAndId("deck", mauiDemiGod.id);
//     Const middle = testStore.getByZoneAndId("deck", goofyKnightForADay.id);
//     Const bottom = testStore.getByZoneAndId("deck", liloGalacticHero.id);
//
//     CardUnderTest.quest();
//
//     TestStore.resolveTopOfStack({ scry: { hand: [middle], bottom: [top] } });
//
//     Expect(middle.zone).toBe("hand");
//     Expect(top.zone).toBe("deck");
//   });
// });
//
