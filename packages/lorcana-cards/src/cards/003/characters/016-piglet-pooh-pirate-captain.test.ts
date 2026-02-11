// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   EeyoreOverstuffedDonkey,
//   PigletPoohPirateCaptain,
//   WendyDarlingAuthorityOnPeterPan,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Piglet - Pooh Pirate Captain", () => {
//   It("**AND I'M THE CAPTAIN!** While you have 2 or more other characters in play, this characters gets +2 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: eeyoreOverstuffedDonkey.cost,
//       Hand: [eeyoreOverstuffedDonkey],
//       Play: [pigletPoohPirateCaptain, wendyDarlingAuthorityOnPeterPan],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PigletPoohPirateCaptain.id,
//     );
//     Const secondChar = testStore.getByZoneAndId(
//       "hand",
//       EeyoreOverstuffedDonkey.id,
//     );
//     Const thirdChar = testStore.getCard(wendyDarlingAuthorityOnPeterPan);
//
//     Expect(cardUnderTest.lore).toEqual(pigletPoohPirateCaptain.lore);
//     SecondChar.playFromHand();
//     Expect(cardUnderTest.lore).toEqual(pigletPoohPirateCaptain.lore + 2);
//
//     Expect(secondChar.lore).toEqual(eeyoreOverstuffedDonkey.lore);
//     Expect(thirdChar.lore).toEqual(wendyDarlingAuthorityOnPeterPan.lore);
//   });
// });
//
