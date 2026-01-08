// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   jollyRogerHooksShip,
//   rlsLegacySolarGalleon,
// } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import {
//   goofyFlyingFool,
//   kakamoraPiratePitcher,
//   mickeyMouseCourageousSailor,
//   minnieMousePirateLookout,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Minnie Mouse - Pirate Lookout", () => {
//   it("LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: minnieMousePirateLookout.cost,
//       play: [minnieMousePirateLookout],
//       hand: [mickeyMouseCourageousSailor, kakamoraPiratePitcher],
//       discard: [jollyRogerHooksShip, goofyFlyingFool, rlsLegacySolarGalleon],
//     });
//
//     const jollyRoger = testEngine.getCardModel(jollyRogerHooksShip);
//     const goofyFlying = testEngine.getCardModel(goofyFlyingFool);
//     const rls = testEngine.getCardModel(rlsLegacySolarGalleon);
//
//     expect(testEngine.getCardZone(jollyRoger)).toBe("discard");
//     await testEngine.putIntoInkwell(mickeyMouseCourageousSailor);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [jollyRoger] });
//
//     expect(testEngine.getCardZone(rls)).toBe("discard");
//     await testEngine.putIntoInkwell(kakamoraPiratePitcher);
//     expect(testEngine.stackLayers).toHaveLength(0);
//     expect(testEngine.getCardZone(rls)).toBe("discard");
//
//     expect(testEngine.getCardZone(jollyRoger)).toBe("hand");
//     expect(testEngine.getCardZone(goofyFlying)).toBe("discard");
//   });
// });
//
