// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   ChiefTui,
//   HeiheiBoatSnack,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ariel - Spectacular Singer", () => {
//   It("MUSICAL DEBUT effect - Song Tutored", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: arielSpectacularSinger.cost,
//       Hand: [arielSpectacularSinger],
//       Deck: [
//         ShieldOfVirtue,
//         ChiefTui,
//         HeiheiBoatSnack,
//         FriendsOnTheOtherSide,
//         TipoGrowingSon,
//         HiramFlavershamToymaker,
//       ],
//     });
//
//     Await testEngine.playCard(arielSpectacularSinger);
//
//     Await testEngine.resolveTopOfStack({
//       Scry: {
//         Bottom: [hiramFlavershamToymaker, tipoGrowingSon, heiheiBoatSnack],
//         Hand: [friendsOnTheOtherSide],
//       },
//     });
//
//     Expect(testEngine.getCardZone(friendsOnTheOtherSide)).toEqual("hand");
//
//     Const bottomCard = testEngine.testStore.getZonesCards().deck[0];
//     Const secondBottomCard = testEngine.testStore.getZonesCards().deck[1];
//     Const thirdBottomCard = testEngine.testStore.getZonesCards().deck[2];
//
//     Expect(bottomCard?.lorcanitoCard?.name).toEqual(
//       HiramFlavershamToymaker.name,
//     );
//     Expect(secondBottomCard?.lorcanitoCard?.name).toEqual(tipoGrowingSon.name);
//     Expect(thirdBottomCard?.lorcanitoCard?.name).toEqual(heiheiBoatSnack.name);
//   });
//   It("MUSICAL DEBUT effect - Missed song", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: arielSpectacularSinger.cost,
//       Hand: [arielSpectacularSinger],
//       Deck: [
//         ShieldOfVirtue,
//         FriendsOnTheOtherSide,
//         ChiefTui,
//         HeiheiBoatSnack,
//         TipoGrowingSon,
//         HiramFlavershamToymaker,
//       ],
//     });
//
//     Await testEngine.playCard(arielSpectacularSinger);
//
//     Await testEngine.resolveTopOfStack({
//       Scry: {
//         Bottom: [
//           HiramFlavershamToymaker,
//           TipoGrowingSon,
//           HeiheiBoatSnack,
//           ChiefTui,
//         ],
//         Hand: [],
//       },
//     });
//
//     Const bottomCard = testEngine.testStore.getZonesCards().deck[0];
//     Const secondBottomCard = testEngine.testStore.getZonesCards().deck[1];
//     Const thirdBottomCard = testEngine.testStore.getZonesCards().deck[2];
//     Const fourthBottomCard = testEngine.testStore.getZonesCards().deck[3];
//
//     Expect(bottomCard?.lorcanitoCard?.name).toEqual(
//       HiramFlavershamToymaker.name,
//     );
//     Expect(secondBottomCard?.lorcanitoCard?.name).toEqual(tipoGrowingSon.name);
//     Expect(thirdBottomCard?.lorcanitoCard?.name).toEqual(heiheiBoatSnack.name);
//     Expect(fourthBottomCard?.lorcanitoCard?.name).toEqual(chiefTui.name);
//   });
// });
//
