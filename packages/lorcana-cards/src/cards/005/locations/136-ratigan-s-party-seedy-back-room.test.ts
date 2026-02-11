// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { monstroWhaleOfAWhale } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { ratigansPartySeedyBackRoom } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ratigan's Party - Seedy Back Room", () => {
//   Describe("**MISFITS’ REVELRY** While you have a damaged character here, this location gets +2 {L}.", () => {
//     It("Should not get +2 lore if the character on location is not damaged.", () => {
//       Const testStore = new TestStore({
//         Inkwell: ratigansPartySeedyBackRoom.cost,
//         Play: [ratigansPartySeedyBackRoom, monstroWhaleOfAWhale],
//       });
//
//       Const cardUnderTest = testStore.getCard(ratigansPartySeedyBackRoom);
//       Const target = testStore.getCard(monstroWhaleOfAWhale);
//
//       Target.enterLocation(cardUnderTest);
//       Expect(cardUnderTest.lore).toBeFalsy();
//       Expect(target.lore).toBe(monstroWhaleOfAWhale.lore);
//     });
//
//     It("Should give +2 lore to location, and only the location.", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: ratigansPartySeedyBackRoom.cost,
//           Play: [ratigansPartySeedyBackRoom, monstroWhaleOfAWhale],
//         },
//         {
//           Play: [liloMakingAWish],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(ratigansPartySeedyBackRoom);
//       Const target = testStore.getCard(monstroWhaleOfAWhale);
//       Const anotherTarget = testStore.getCard(liloMakingAWish);
//
//       Target.enterLocation(cardUnderTest);
//
//       Target.updateCardDamage(1);
//
//       Expect(cardUnderTest.lore).toEqual(2);
//       Expect(target.lore).toBe(monstroWhaleOfAWhale.lore);
//       Expect(anotherTarget.lore).toBe(liloMakingAWish.lore);
//     });
//   });
// });
//
