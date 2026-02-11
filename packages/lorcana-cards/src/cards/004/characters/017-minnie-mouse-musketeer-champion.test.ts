// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MinnieMouseMusketeerChampion,
//   SisuEmpoweredSibling,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Minnie Mouse - Musketeer Champion", () => {
//   It("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)", () => {
//     Const testStore = new TestStore({
//       Play: [minnieMouseMusketeerChampion],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MinnieMouseMusketeerChampion.id,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("**DRAMATIC ENTERANCE** When you play this character, banish chosen opposing character with 5  {S} or more.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: minnieMouseMusketeerChampion.cost,
//         Hand: [minnieMouseMusketeerChampion],
//       },
//       { play: [sisuEmpoweredSibling] },
//     );
//     Const cardUnderTest = testStore.getCard(minnieMouseMusketeerChampion);
//     Const target = testStore.getCard(sisuEmpoweredSibling);
//
//     CardUnderTest.playFromHand({ bodyguard: true });
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
