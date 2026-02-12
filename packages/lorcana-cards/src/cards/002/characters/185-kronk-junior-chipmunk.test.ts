// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HerculesHeroInTraining,
//   KronkJuniorChipmunk,
//   PachaVillageLeader,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kronk- Junior Chipmunk", () => {
//   It("Resist 1", () => {
//     Const testStore = new TestStore({
//       Play: [kronkJuniorChipmunk],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       KronkJuniorChipmunk.id,
//     );
//
//     Expect(cardUnderTest.hasResist).toBeTruthy();
//     Expect(cardUnderTest.damageReduction()).toEqual(1);
//   });
//
//   Describe("**SCOUT LEADER** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.", () => {
//     Describe("During your turn", () => {
//       It("Banish another character in a challenge", () => {
//         Const testStore = new TestStore(
//           {
//             Play: [kronkJuniorChipmunk],
//           },
//           { play: [herculesHeroInTraining, pachaVillageLeader] },
//         );
//
//         Const attacker = testStore.getCard(kronkJuniorChipmunk);
//         Const defender = testStore.getCard(herculesHeroInTraining);
//         Const target = testStore.getCard(pachaVillageLeader);
//
//         Defender.updateCardMeta({ exerted: true });
//
//         Attacker.challenge(defender);
//         TestStore.resolveOptionalAbility();
//         TestStore.resolveTopOfStack({ targets: [target] });
//
//         Expect(defender.isDead).toBeTruthy();
//         Expect(target.meta.damage).toEqual(2);
//         Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       });
//     });
//   });
// });
//
