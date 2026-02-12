// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { starkeyDeviousPirate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("And Then Along Came Zeus", () => {
//   Describe("_(A character with cost 4 or more can {E} to sing this song for free.)_Deal 5 damage to chosen character or location.", () => {});
//   It("should deal 5 damage to chosen character", () => {
//     Const testStore = new TestStore({
//       Inkwell: andThenAlongCameZeus.cost,
//       Hand: [andThenAlongCameZeus],
//       Play: [starkeyDeviousPirate],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       AndThenAlongCameZeus.id,
//     );
//
//     Const target = testStore.getByZoneAndId("play", starkeyDeviousPirate.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toBe(5);
//   });
//
//   It("should deal 5 damage to chosen location", () => {
//     Const testStore = new TestStore({
//       Inkwell: andThenAlongCameZeus.cost,
//       Hand: [andThenAlongCameZeus],
//       Play: [forbiddenMountainMaleficentsCastle],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       AndThenAlongCameZeus.id,
//     );
//
//     Const target = testStore.getByZoneAndId(
//       "play",
//       ForbiddenMountainMaleficentsCastle.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toBe(5);
//   });
// });
//
