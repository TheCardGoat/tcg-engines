// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { monstroWhaleOfAWhale } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { ratigansPartySeedyBackRoom } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ratigan's Party - Seedy Back Room", () => {
//   describe("**MISFITS’ REVELRY** While you have a damaged character here, this location gets +2 {L}.", () => {
//     it("Should not get +2 lore if the character on location is not damaged.", () => {
//       const testStore = new TestStore({
//         inkwell: ratigansPartySeedyBackRoom.cost,
//         play: [ratigansPartySeedyBackRoom, monstroWhaleOfAWhale],
//       });
//
//       const cardUnderTest = testStore.getCard(ratigansPartySeedyBackRoom);
//       const target = testStore.getCard(monstroWhaleOfAWhale);
//
//       target.enterLocation(cardUnderTest);
//       expect(cardUnderTest.lore).toBeFalsy();
//       expect(target.lore).toBe(monstroWhaleOfAWhale.lore);
//     });
//
//     it("Should give +2 lore to location, and only the location.", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: ratigansPartySeedyBackRoom.cost,
//           play: [ratigansPartySeedyBackRoom, monstroWhaleOfAWhale],
//         },
//         {
//           play: [liloMakingAWish],
//         },
//       );
//
//       const cardUnderTest = testStore.getCard(ratigansPartySeedyBackRoom);
//       const target = testStore.getCard(monstroWhaleOfAWhale);
//       const anotherTarget = testStore.getCard(liloMakingAWish);
//
//       target.enterLocation(cardUnderTest);
//
//       target.updateCardDamage(1);
//
//       expect(cardUnderTest.lore).toEqual(2);
//       expect(target.lore).toBe(monstroWhaleOfAWhale.lore);
//       expect(anotherTarget.lore).toBe(liloMakingAWish.lore);
//     });
//   });
// });
//
