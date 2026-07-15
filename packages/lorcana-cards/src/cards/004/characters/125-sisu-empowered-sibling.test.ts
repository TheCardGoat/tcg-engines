// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AgustinMadrigalClumsyDad,
//   AntonioMadrigalAnimalExpert,
//   DaisyDuckLovelyLady,
//   SisuEmpoweredSibling,
//   TongSurvivor,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { iceBlock } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sisu - Empowered Sibling", () => {
//   It("**LET ME HANDLE THIS!** When you play this character, banish all opposing characters with 2 {S} or less.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: sisuEmpoweredSibling.cost,
//         Hand: [sisuEmpoweredSibling],
//         Play: [
//           AgustinMadrigalClumsyDad,
//           DaisyDuckLovelyLady,
//           AntonioMadrigalAnimalExpert,
//         ],
//       },
//       {
//         Play: [
//           AgustinMadrigalClumsyDad,
//           DaisyDuckLovelyLady,
//           AntonioMadrigalAnimalExpert,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       SisuEmpoweredSibling.id,
//     );
//     CardUnderTest.playFromHand();
//
//     Expect(
//       TestStore.getByZoneAndId("play", agustinMadrigalClumsyDad.id).zone,
//     ).toBeTruthy();
//     Expect(
//       TestStore.getByZoneAndId("play", daisyDuckLovelyLady.id).zone,
//     ).toBeTruthy();
//     Expect(
//       TestStore.getByZoneAndId("play", antonioMadrigalAnimalExpert.id),
//     ).toBeTruthy();
//
//     Expect(
//       TestStore.getByZoneAndId(
//         "discard",
//         AgustinMadrigalClumsyDad.id,
//         "player_two",
//       ).zone,
//     ).toEqual("discard");
//     Expect(
//       TestStore.getByZoneAndId("discard", daisyDuckLovelyLady.id, "player_two")
//         .zone,
//     ).toEqual("discard");
//     Expect(
//       TestStore.getByZoneAndId(
//         "play",
//         AntonioMadrigalAnimalExpert.id,
//         "player_two",
//       ),
//     ).toBeTruthy();
//   });
// });
//
// Describe("Regression", () => {
//   It("Should combo correctly with Ice block", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: sisuEmpoweredSibling.cost,
//         Hand: [sisuEmpoweredSibling],
//         Play: [iceBlock],
//       },
//       {
//         Play: [tongSurvivor],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(sisuEmpoweredSibling);
//     Const debuff = testStore.getCard(iceBlock);
//     Const target = testStore.getCard(tongSurvivor);
//
//     Debuff.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toBe(tongSurvivor.strength - 1);
//
//     CardUnderTest.playFromHand();
//
//     Expect(target.zone).toBe("discard");
//   });
// });
//
