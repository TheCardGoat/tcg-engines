// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   CaptainHookCaptainOfTheJollyRoger,
//   ScarShamelessFirebrand,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Captain Hook Captain of the Jolly Roger", () => {
//   It("DOUBLE THE POWDER! effect - returning an Fire The Cannon", () => {
//     Const testStore = new TestStore({
//       Inkwell: captainHookCaptainOfTheJollyRoger.cost,
//       Hand: [captainHookCaptainOfTheJollyRoger],
//       Discard: [fireTheCannons],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       CaptainHookCaptainOfTheJollyRoger.id,
//     );
//     Const target = testStore.getByZoneAndId("discard", fireTheCannons.id);
//     Expect(target.zone).toEqual("discard");
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 1 }),
//     );
//   });
//
//   It("DOUBLE THE POWDER! effect - not returning an Fire The Cannon", () => {
//     Const testStore = new TestStore({
//       Inkwell: captainHookCaptainOfTheJollyRoger.cost,
//       Hand: [captainHookCaptainOfTheJollyRoger],
//       Discard: [scarShamelessFirebrand],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       CaptainHookCaptainOfTheJollyRoger.id,
//     );
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 0, discard: 1, play: 1 }),
//     );
//     Expect(testStore.stackLayers).toHaveLength(0);
//   });
// });
//
