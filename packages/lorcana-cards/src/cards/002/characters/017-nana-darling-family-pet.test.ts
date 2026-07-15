// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   HerculesDivineHero,
//   NanaDarlingFamilyPet,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Nana - Darling Family Pet", () => {
//   Describe("**NURSEMAID** Whenever you play a Floodborn character, you may remove all damage from chosen character.", () => {
//     It("Playing a floodborn", () => {
//       Const testStore = new TestStore({
//         Inkwell: herculesDivineHero.cost,
//         Hand: [herculesDivineHero],
//         Play: [nanaDarlingFamilyPet, goofyKnightForADay],
//       });
//
//       Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//       Const floodbornChar = testStore.getByZoneAndId(
//         "hand",
//         HerculesDivineHero.id,
//       );
//
//       Target.damage = goofyKnightForADay.willpower - 1;
//
//       FloodbornChar.playFromHand();
//       Expect(testStore.stackLayers).toHaveLength(1);
//
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(target.damage).toEqual(0);
//     });
//   });
// });
//
