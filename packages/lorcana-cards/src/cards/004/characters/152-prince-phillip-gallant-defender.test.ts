// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { princePhillipGallantDefender } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince Phillip - Gallant Defender", () => {
//   It.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_ **BEST DEFENSE** Whenver one of your characters is chosen for **Support**, they gain **Resist** +1 this turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     Const testStore = new TestStore({
//       Play: [princePhillipGallantDefender],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PrincePhillipGallantDefender.id,
//     );
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
