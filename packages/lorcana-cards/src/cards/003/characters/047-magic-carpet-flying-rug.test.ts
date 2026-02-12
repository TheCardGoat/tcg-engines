// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicCarpetFlyingRug } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { taffytaMuttonfudgeSourSpeedster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Carpet - Flying Rug", () => {
//   Describe("**FIND THE WAY** {E} – Move a character of yours to a location for free.", () => {
//     It("should move a character to a location for free", async () => {
//       Const testStore = new TestStore({
//         Play: [magicCarpetFlyingRug, rapunzelsTowerSecludedPrison],
//       });
//
//       Const cardUnderTest = testStore.getCard(magicCarpetFlyingRug);
//       Const locationUnderTest = testStore.getCard(rapunzelsTowerSecludedPrison);
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targets: [cardUnderTest] }, true);
//       TestStore.resolveTopOfStack({ targets: [locationUnderTest] });
//       Expect(cardUnderTest.isAtLocation(locationUnderTest)).toBe(true);
//     });
//
//     It("Should trigger enter location triggers", async () => {
//       Const testEngine = new TestEngine({
//         Play: [
//           HiddenCoveTranquilHaven,
//           MagicCarpetFlyingRug,
//           TaffytaMuttonfudgeSourSpeedster,
//         ],
//       });
//
//       Await testEngine.activateCard(magicCarpetFlyingRug);
//       Await testEngine.resolveTopOfStack(
//         { targets: [taffytaMuttonfudgeSourSpeedster] },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [hiddenCoveTranquilHaven],
//       });
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//     });
//   });
// });
//
