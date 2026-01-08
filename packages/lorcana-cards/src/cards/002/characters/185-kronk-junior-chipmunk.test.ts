// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   herculesHeroInTraining,
//   kronkJuniorChipmunk,
//   pachaVillageLeader,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Kronk- Junior Chipmunk", () => {
//   it("Resist 1", () => {
//     const testStore = new TestStore({
//       play: [kronkJuniorChipmunk],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       kronkJuniorChipmunk.id,
//     );
//
//     expect(cardUnderTest.hasResist).toBeTruthy();
//     expect(cardUnderTest.damageReduction()).toEqual(1);
//   });
//
//   describe("**SCOUT LEADER** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.", () => {
//     describe("During your turn", () => {
//       it("Banish another character in a challenge", () => {
//         const testStore = new TestStore(
//           {
//             play: [kronkJuniorChipmunk],
//           },
//           { play: [herculesHeroInTraining, pachaVillageLeader] },
//         );
//
//         const attacker = testStore.getCard(kronkJuniorChipmunk);
//         const defender = testStore.getCard(herculesHeroInTraining);
//         const target = testStore.getCard(pachaVillageLeader);
//
//         defender.updateCardMeta({ exerted: true });
//
//         attacker.challenge(defender);
//         testStore.resolveOptionalAbility();
//         testStore.resolveTopOfStack({ targets: [target] });
//
//         expect(defender.isDead).toBeTruthy();
//         expect(target.meta.damage).toEqual(2);
//         expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       });
//     });
//   });
// });
//
