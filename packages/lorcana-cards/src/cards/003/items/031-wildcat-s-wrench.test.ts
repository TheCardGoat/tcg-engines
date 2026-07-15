// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { wildcatsWrench } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Wildcat’s Wrench", () => {
//   It("**REBUILD** {E} – Remove up to 2 damage from chosen location.", () => {
//     Const testStore = new TestStore({
//       Play: [wildcatsWrench, forbiddenMountainMaleficentsCastle],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", wildcatsWrench.id);
//     Const targetLocation = testStore.getByZoneAndId(
//       "play",
//       ForbiddenMountainMaleficentsCastle.id,
//     );
//
//     TargetLocation.updateCardMeta({ damage: 2 });
//     Expect(targetLocation.damage).toBe(2);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [targetLocation] });
//
//     Expect(targetLocation.damage).toBe(0);
//     Expect(cardUnderTest.meta.exerted).toBe(true);
//   });
// });
//
