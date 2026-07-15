// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   EeyoreOverstuffedDonkey,
//   MamaOdieVoiceOfWisdom,
//   PigletPoohPirateCaptain,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { cleansingRainwater } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cleansing Rainwater", () => {
//   Describe("**ANCIENT POWER** Banish this item – Remove up to 2 damage from each of your characters.", () => {
//     It("Remove 2 damage from characters", () => {
//       Const testStore = new TestStore({
//         Inkwell: 9,
//         Play: [
//           CleansingRainwater,
//           MamaOdieVoiceOfWisdom,
//           PigletPoohPirateCaptain,
//           EeyoreOverstuffedDonkey,
//         ],
//         Discard: [],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CleansingRainwater.id,
//       );
//       Const damagedCharacter = testStore.getByZoneAndId(
//         "play",
//         MamaOdieVoiceOfWisdom.id,
//       );
//       Const anotherDamagedCharacter = testStore.getByZoneAndId(
//         "play",
//         PigletPoohPirateCaptain.id,
//       );
//       Const yetAnotherDamagedCharacter = testStore.getByZoneAndId(
//         "play",
//         EeyoreOverstuffedDonkey.id,
//       );
//
//       DamagedCharacter.updateCardMeta({ damage: 2 });
//       AnotherDamagedCharacter.updateCardMeta({ damage: 2 });
//       YetAnotherDamagedCharacter.updateCardMeta({ damage: 2 });
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack();
//
//       Expect(damagedCharacter.meta.damage).toEqual(0);
//       Expect(anotherDamagedCharacter.meta.damage).toEqual(0);
//       Expect(yetAnotherDamagedCharacter.meta.damage).toEqual(0);
//     });
//
//     It("Remove up to 2 damage from characters", () => {
//       Const testStore = new TestStore({
//         Inkwell: 9,
//         Play: [
//           CleansingRainwater,
//           MamaOdieVoiceOfWisdom,
//           PigletPoohPirateCaptain,
//           EeyoreOverstuffedDonkey,
//         ],
//         Discard: [],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CleansingRainwater.id,
//       );
//       Const damagedCharacter = testStore.getByZoneAndId(
//         "play",
//         MamaOdieVoiceOfWisdom.id,
//       );
//       Const anotherDamagedCharacter = testStore.getByZoneAndId(
//         "play",
//         PigletPoohPirateCaptain.id,
//       );
//       Const yetAnotherDamagedCharacter = testStore.getByZoneAndId(
//         "play",
//         EeyoreOverstuffedDonkey.id,
//       );
//
//       DamagedCharacter.updateCardMeta({ damage: 5 });
//       AnotherDamagedCharacter.updateCardMeta({ damage: 1 });
//       YetAnotherDamagedCharacter.updateCardMeta({ damage: 4 });
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack();
//
//       Expect(damagedCharacter.meta.damage).toEqual(3);
//       Expect(anotherDamagedCharacter.meta.damage).toEqual(0);
//       Expect(yetAnotherDamagedCharacter.meta.damage).toEqual(2);
//     });
//   });
// });
//
