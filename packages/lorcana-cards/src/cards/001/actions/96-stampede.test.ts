// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { stampede } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { aladdinHeroicOutlaw } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Stampede", () => {
//   It("Deal 2 damage to chosen damaged character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: stampede.cost,
//       Hand: [stampede],
//       Play: [aladdinHeroicOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", stampede.id);
//     Const target = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);
//     Target.updateCardMeta({ damage: 2 });
//     Expect(
//       TestStore.getByZoneAndId("play", aladdinHeroicOutlaw.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 2 }));
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(
//       TestStore.getByZoneAndId("play", aladdinHeroicOutlaw.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 4 }));
//   });
// });
//
