// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jimHawkinsSpaceTraveler } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   PrideLandsJungleOasis,
//   RapunzelsTowerSecludedPrison,
// } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jim Hawkins - Space Traveler", () => {
//   It("**THIS IS IT!** When you play this character, you may play a location with cost 4 or less for free.", () => {
//     Const testStore = new TestStore({
//       Inkwell: jimHawkinsSpaceTraveler.cost,
//       Hand: [jimHawkinsSpaceTraveler, rapunzelsTowerSecludedPrison],
//     });
//
//     Const cardUnderTest = testStore.getCard(jimHawkinsSpaceTraveler);
//     Const targetLocation = testStore.getCard(rapunzelsTowerSecludedPrison);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [targetLocation] }, true);
//     TestStore.resolveOptionalAbility();
//     Expect(targetLocation.zone).toBe("play");
//     Expect(cardUnderTest.isAtLocation(targetLocation)).toBe(true);
//   });
//
//   It("**TAKE THE HELM** Whenever you play a location, this character may move there for free.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rapunzelsTowerSecludedPrison.cost,
//       Hand: [rapunzelsTowerSecludedPrison],
//       Play: [jimHawkinsSpaceTraveler, prideLandsJungleOasis],
//     });
//
//     Const cardUnderTest = testStore.getCard(jimHawkinsSpaceTraveler);
//     Const targetLocation = testStore.getCard(rapunzelsTowerSecludedPrison);
//
//     TargetLocation.playFromHand();
//     TestStore.resolveOptionalAbility();
//     Expect(cardUnderTest.isAtLocation(targetLocation)).toBe(true);
//   });
// });
//
