// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JollyRogerHooksShip,
//   RlsLegacySolarGalleon,
// } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import {
//   GoofyFlyingFool,
//   KakamoraPiratePitcher,
//   MickeyMouseCourageousSailor,
//   MinnieMousePirateLookout,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Minnie Mouse - Pirate Lookout", () => {
//   It("LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: minnieMousePirateLookout.cost,
//       Play: [minnieMousePirateLookout],
//       Hand: [mickeyMouseCourageousSailor, kakamoraPiratePitcher],
//       Discard: [jollyRogerHooksShip, goofyFlyingFool, rlsLegacySolarGalleon],
//     });
//
//     Const jollyRoger = testEngine.getCardModel(jollyRogerHooksShip);
//     Const goofyFlying = testEngine.getCardModel(goofyFlyingFool);
//     Const rls = testEngine.getCardModel(rlsLegacySolarGalleon);
//
//     Expect(testEngine.getCardZone(jollyRoger)).toBe("discard");
//     Await testEngine.putIntoInkwell(mickeyMouseCourageousSailor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [jollyRoger] });
//
//     Expect(testEngine.getCardZone(rls)).toBe("discard");
//     Await testEngine.putIntoInkwell(kakamoraPiratePitcher);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getCardZone(rls)).toBe("discard");
//
//     Expect(testEngine.getCardZone(jollyRoger)).toBe("hand");
//     Expect(testEngine.getCardZone(goofyFlying)).toBe("discard");
//   });
// });
//
