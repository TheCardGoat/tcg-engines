// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { neverLandMermaidLagoon } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { launchpadExceptionalPilot } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Launchpad - Exceptional Pilot", () => {
//   Describe("OFF THE MAP - Basic Functionality", () => {
//     It("triggers when character is played and banishes chosen location", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: launchpadExceptionalPilot.cost,
//         Hand: [launchpadExceptionalPilot],
//         Play: [neverLandMermaidLagoon],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       Const target = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       Expect(target.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("discard");
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("can banish any location in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: launchpadExceptionalPilot.cost,
//           Hand: [launchpadExceptionalPilot],
//           Play: [neverLandMermaidLagoon],
//         },
//         {
//           Play: [neverLandMermaidLagoon],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         LaunchpadExceptionalPilot,
//         0,
//       );
//       Const opponentLocation = testEngine.getCardModel(
//         NeverLandMermaidLagoon,
//         1,
//       );
//
//       Expect(opponentLocation.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [opponentLocation] });
//
//       Expect(opponentLocation.zone).toBe("discard");
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("can banish opponent's locations", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: launchpadExceptionalPilot.cost,
//           Hand: [launchpadExceptionalPilot],
//         },
//         {
//           Play: [neverLandMermaidLagoon],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         LaunchpadExceptionalPilot,
//         0,
//       );
//       Const opponentLocation = testEngine.getCardModel(
//         NeverLandMermaidLagoon,
//         1,
//       );
//
//       Expect(opponentLocation.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [opponentLocation] });
//
//       Expect(opponentLocation.zone).toBe("discard");
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("can banish own locations", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: launchpadExceptionalPilot.cost,
//         Hand: [launchpadExceptionalPilot],
//         Play: [neverLandMermaidLagoon],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       Const ownLocation = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       Expect(ownLocation.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [ownLocation] });
//
//       Expect(ownLocation.zone).toBe("discard");
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
//
//   Describe("OFF THE MAP - Optional Ability", () => {
//     It("ability is optional - can decline to banish", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: launchpadExceptionalPilot.cost,
//         Hand: [launchpadExceptionalPilot],
//         Play: [neverLandMermaidLagoon],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       Const target = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Decline the optional ability
//       Await testEngine.skipTopOfStack();
//
//       // Location should remain in play
//       Expect(target.zone).toBe("play");
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
//
//   Describe("OFF THE MAP - Trigger Conditions", () => {
//     It("only triggers when Launchpad is played, not other characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 8,
//         Hand: [launchpadExceptionalPilot, launchpadExceptionalPilot],
//         Play: [neverLandMermaidLagoon],
//       });
//
//       Const firstLaunchpad = testEngine.getCardModel(
//         LaunchpadExceptionalPilot,
//         0,
//       );
//       Const secondLaunchpad = testEngine.getCardModel(
//         LaunchpadExceptionalPilot,
//         1,
//       );
//       Const location = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       Expect(location.zone).toBe("play");
//
//       // Play first Launchpad
//       Await testEngine.playCard(firstLaunchpad);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [location] });
//
//       Expect(location.zone).toBe("discard");
//       Expect(firstLaunchpad.zone).toBe("play");
//
//       // Play second Launchpad (no locations left to banish)
//       Await testEngine.playCard(secondLaunchpad);
//
//       // Ability should still trigger but resolve without effect
//       Expect(secondLaunchpad.zone).toBe("play");
//     });
//
//     It("does not trigger when character is already in play", async () => {
//       Const testEngine = new TestEngine({
//         Play: [launchpadExceptionalPilot, neverLandMermaidLagoon],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       Const location = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       // Character is already in play, playing it again should not be possible
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(location.zone).toBe("play");
//       Expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//     });
//   });
//
//   Describe("OFF THE MAP - Edge Cases", () => {
//     It("works when no locations are in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: launchpadExceptionalPilot.cost,
//         Hand: [launchpadExceptionalPilot],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//
//       // Should play successfully even with no valid targets
//       Await testEngine.playCard(cardUnderTest);
//
//       // Ability should still trigger but resolve without effect
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("only banishes one location per play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: launchpadExceptionalPilot.cost,
//         Hand: [launchpadExceptionalPilot],
//         Play: [neverLandMermaidLagoon, neverLandMermaidLagoon],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       Const firstLocation = testEngine.getCardModel(neverLandMermaidLagoon, 0);
//       Const secondLocation = testEngine.getCardModel(neverLandMermaidLagoon, 1);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [firstLocation] });
//
//       // Only first location should be banished
//       Expect(firstLocation.zone).toBe("discard");
//       Expect(secondLocation.zone).toBe("play");
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("cannot target characters, only locations", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: launchpadExceptionalPilot.cost,
//           Hand: [launchpadExceptionalPilot],
//         },
//         {
//           Play: [launchpadExceptionalPilot], // Another character, not a location
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         LaunchpadExceptionalPilot,
//         0,
//       );
//       Const opponentCharacter = testEngine.getCardModel(
//         LaunchpadExceptionalPilot,
//         1,
//       );
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Ability triggers but has no valid targets (no locations in play), so it's skipped
//       // Both characters should still be in play
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(opponentCharacter.zone).toBe("play");
//     });
//   });
//
//   Describe("OFF THE MAP - Multiple Locations Scenario", () => {
//     It("allows player to choose which location to banish when multiple are available", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: launchpadExceptionalPilot.cost,
//         Hand: [launchpadExceptionalPilot],
//         Play: [neverLandMermaidLagoon, neverLandMermaidLagoon],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       Const location1 = testEngine.getCardModel(neverLandMermaidLagoon, 0);
//       Const location2 = testEngine.getCardModel(neverLandMermaidLagoon, 1);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//
//       // Choose to banish the second location
//       Await testEngine.resolveTopOfStack({ targets: [location2] });
//
//       // Only the chosen location should be banished
//       Expect(location1.zone).toBe("play");
//       Expect(location2.zone).toBe("discard");
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
