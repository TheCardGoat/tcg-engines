// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   goofyKnightForADay,
//   herculesDivineHero,
//   nanaDarlingFamilyPet,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Nana - Darling Family Pet", () => {
//   describe("**NURSEMAID** Whenever you play a Floodborn character, you may remove all damage from chosen character.", () => {
//     it("Playing a floodborn", () => {
//       const testStore = new TestStore({
//         inkwell: herculesDivineHero.cost,
//         hand: [herculesDivineHero],
//         play: [nanaDarlingFamilyPet, goofyKnightForADay],
//       });
//
//       const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//       const floodbornChar = testStore.getByZoneAndId(
//         "hand",
//         herculesDivineHero.id,
//       );
//
//       target.damage = goofyKnightForADay.willpower - 1;
//
//       floodbornChar.playFromHand();
//       expect(testStore.stackLayers).toHaveLength(1);
//
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({ targets: [target] });
//       expect(target.damage).toEqual(0);
//     });
//   });
// });
//
