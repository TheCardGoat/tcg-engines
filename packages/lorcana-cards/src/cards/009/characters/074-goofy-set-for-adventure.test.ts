// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theLibraryAGiftForBelle } from "@lorcanito/lorcana-engine/cards/005/locations/068-the-library-a-gift-for-belle";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { goofySetForAdventure } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy - Set for Adventure", () => {
//   It("FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goofySetForAdventure.cost,
//       Play: [
//         GoofySetForAdventure,
//         TheLibraryAGiftForBelle,
//         DeweyLovableShowoff,
//       ],
//     });
//
//     Await testEngine.moveToLocation({
//       Location: theLibraryAGiftForBelle,
//       Character: goofySetForAdventure,
//     });
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       { targets: [deweyLovableShowoff] },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({ targets: [theLibraryAGiftForBelle] });
//
//     Const location = testEngine.getCardModel(theLibraryAGiftForBelle);
//
//     Expect(location.getCardsAtLocation).toHaveLength(2);
//     Expect(
//       TestEngine.getCardModel(deweyLovableShowoff).isAtLocation(location),
//     ).toBe(true);
//   });
// });
//
