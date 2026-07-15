// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   BuckySquirrelSqueakTutor,
//   CheshireCatAlwaysGrinning,
//   CheshireCatFromTheShadows,
//   HerculesDivineHero,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bucky - Squirrel Squeak Tutor", () => {
//   Describe("**SQUEAK** Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.", () => {
//     It("Playing a Floodborn character without Shift", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: herculesDivineHero.cost,
//           Hand: [herculesDivineHero],
//           Play: [buckySquirrelSqueakTutor],
//         },
//         {
//           Hand: [liloGalacticHero],
//         },
//       );
//
//       Const floodbornChar = testStore.getByZoneAndId(
//         "hand",
//         HerculesDivineHero.id,
//       );
//
//       FloodbornChar.playFromHand();
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("Playing a Floodborn character with Shift", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: cheshireCatFromTheShadows.cost,
//           Hand: [cheshireCatFromTheShadows],
//           Play: [buckySquirrelSqueakTutor, cheshireCatAlwaysGrinning],
//         },
//         {
//           Hand: [liloGalacticHero],
//         },
//       );
//
//       Const floodbornChar = testStore.getCard(cheshireCatFromTheShadows);
//       Const shiftedChar = testStore.getCard(cheshireCatAlwaysGrinning);
//       Const shifterChar = testStore.getCard(cheshireCatFromTheShadows);
//       Const target = testStore.getCard(liloGalacticHero);
//
//       ShifterChar.shift(shiftedChar);
//
//       Expect(testStore.stackLayers).toHaveLength(1);
//       TestStore.changePlayer().resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("discard");
//     });
//   });
// });
//
