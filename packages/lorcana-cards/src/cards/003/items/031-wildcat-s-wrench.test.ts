// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { wildcatsWrench } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Wildcat’s Wrench", () => {
//   it("**REBUILD** {E} – Remove up to 2 damage from chosen location.", () => {
//     const testStore = new TestStore({
//       play: [wildcatsWrench, forbiddenMountainMaleficentsCastle],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", wildcatsWrench.id);
//     const targetLocation = testStore.getByZoneAndId(
//       "play",
//       forbiddenMountainMaleficentsCastle.id,
//     );
//
//     targetLocation.updateCardMeta({ damage: 2 });
//     expect(targetLocation.damage).toBe(2);
//
//     cardUnderTest.activate();
//     testStore.resolveTopOfStack({ targets: [targetLocation] });
//
//     expect(targetLocation.damage).toBe(0);
//     expect(cardUnderTest.meta.exerted).toBe(true);
//   });
// });
//
