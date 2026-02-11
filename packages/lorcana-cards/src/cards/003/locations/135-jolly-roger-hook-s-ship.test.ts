// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseArtfulRogue } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { jollyRogerHooksShip } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jolly Roger - Hook's Ship", () => {
//   It("should grant Rush to characters", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jollyRogerHooksShip.moveCost * 2,
//       Play: [jollyRogerHooksShip, mrSmeeBumblingMate, mickeyMouseArtfulRogue],
//     });
//
//     Const { location: jolly, character: mrSmee } =
//       Await testEngine.moveToLocation({
//         Location: jollyRogerHooksShip,
//         Character: mrSmeeBumblingMate,
//       });
//
//     // Move Mickey Mouse (Artful Rogue) to the location and check for Rush
//     Const { character: mickey } = await testEngine.moveToLocation({
//       Location: jollyRogerHooksShip,
//       Character: mickeyMouseArtfulRogue,
//     });
//
//     // Check for Rush ability using the hasRush property
//     Expect(mickey.isAtLocation(jolly)).toBe(true);
//     Expect(mickey.hasRush).toBe(true);
//
//     Expect(mrSmee.isAtLocation(jolly)).toBe(true);
//
//     // Ensure no additional stack layers are present
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
//
//   It("should allow Pirate characters to move for free", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 0,
//       Play: [jollyRogerHooksShip, mrSmeeBumblingMate, mickeyMouseArtfulRogue],
//     });
//
//     // Move Mr. Smee (a Pirate) to the location and check for free movement
//     Const { location: jolly, character: mrSmee } =
//       Await testEngine.moveToLocation({
//         Location: jollyRogerHooksShip,
//         Character: mrSmeeBumblingMate,
//       });
//
//     Expect(jolly.containsCharacter(mrSmee)).toBe(true);
//
//     // Try to move Mickey Mouse (Artful Rogue) to the location, it should fail as we don't have enough ink
//     Const { character: mickey } = await testEngine.moveToLocation({
//       Location: jollyRogerHooksShip,
//       Character: mickeyMouseArtfulRogue,
//       SkipAssertion: true,
//     });
//
//     Expect(jolly.containsCharacter(mickey)).toBe(false);
//
//     // Ensure no additional stack layers are present
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
