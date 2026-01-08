// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { neverLandMermaidLagoon } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { launchpadExceptionalPilot } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Launchpad - Exceptional Pilot", () => {
//   describe("OFF THE MAP - Basic Functionality", () => {
//     it("triggers when character is played and banishes chosen location", async () => {
//       const testEngine = new TestEngine({
//         inkwell: launchpadExceptionalPilot.cost,
//         hand: [launchpadExceptionalPilot],
//         play: [neverLandMermaidLagoon],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       const target = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       expect(target.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).toBe("discard");
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("can banish any location in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: launchpadExceptionalPilot.cost,
//           hand: [launchpadExceptionalPilot],
//           play: [neverLandMermaidLagoon],
//         },
//         {
//           play: [neverLandMermaidLagoon],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         launchpadExceptionalPilot,
//         0,
//       );
//       const opponentLocation = testEngine.getCardModel(
//         neverLandMermaidLagoon,
//         1,
//       );
//
//       expect(opponentLocation.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [opponentLocation] });
//
//       expect(opponentLocation.zone).toBe("discard");
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("can banish opponent's locations", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: launchpadExceptionalPilot.cost,
//           hand: [launchpadExceptionalPilot],
//         },
//         {
//           play: [neverLandMermaidLagoon],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         launchpadExceptionalPilot,
//         0,
//       );
//       const opponentLocation = testEngine.getCardModel(
//         neverLandMermaidLagoon,
//         1,
//       );
//
//       expect(opponentLocation.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [opponentLocation] });
//
//       expect(opponentLocation.zone).toBe("discard");
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("can banish own locations", async () => {
//       const testEngine = new TestEngine({
//         inkwell: launchpadExceptionalPilot.cost,
//         hand: [launchpadExceptionalPilot],
//         play: [neverLandMermaidLagoon],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       const ownLocation = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       expect(ownLocation.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [ownLocation] });
//
//       expect(ownLocation.zone).toBe("discard");
//       expect(cardUnderTest.zone).toBe("play");
//     });
//   });
//
//   describe("OFF THE MAP - Optional Ability", () => {
//     it("ability is optional - can decline to banish", async () => {
//       const testEngine = new TestEngine({
//         inkwell: launchpadExceptionalPilot.cost,
//         hand: [launchpadExceptionalPilot],
//         play: [neverLandMermaidLagoon],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       const target = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Decline the optional ability
//       await testEngine.skipTopOfStack();
//
//       // Location should remain in play
//       expect(target.zone).toBe("play");
//       expect(cardUnderTest.zone).toBe("play");
//     });
//   });
//
//   describe("OFF THE MAP - Trigger Conditions", () => {
//     it("only triggers when Launchpad is played, not other characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 8,
//         hand: [launchpadExceptionalPilot, launchpadExceptionalPilot],
//         play: [neverLandMermaidLagoon],
//       });
//
//       const firstLaunchpad = testEngine.getCardModel(
//         launchpadExceptionalPilot,
//         0,
//       );
//       const secondLaunchpad = testEngine.getCardModel(
//         launchpadExceptionalPilot,
//         1,
//       );
//       const location = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       expect(location.zone).toBe("play");
//
//       // Play first Launchpad
//       await testEngine.playCard(firstLaunchpad);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [location] });
//
//       expect(location.zone).toBe("discard");
//       expect(firstLaunchpad.zone).toBe("play");
//
//       // Play second Launchpad (no locations left to banish)
//       await testEngine.playCard(secondLaunchpad);
//
//       // Ability should still trigger but resolve without effect
//       expect(secondLaunchpad.zone).toBe("play");
//     });
//
//     it("does not trigger when character is already in play", async () => {
//       const testEngine = new TestEngine({
//         play: [launchpadExceptionalPilot, neverLandMermaidLagoon],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       const location = testEngine.getCardModel(neverLandMermaidLagoon);
//
//       // Character is already in play, playing it again should not be possible
//       expect(cardUnderTest.zone).toBe("play");
//       expect(location.zone).toBe("play");
//       expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//     });
//   });
//
//   describe("OFF THE MAP - Edge Cases", () => {
//     it("works when no locations are in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: launchpadExceptionalPilot.cost,
//         hand: [launchpadExceptionalPilot],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//
//       // Should play successfully even with no valid targets
//       await testEngine.playCard(cardUnderTest);
//
//       // Ability should still trigger but resolve without effect
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("only banishes one location per play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: launchpadExceptionalPilot.cost,
//         hand: [launchpadExceptionalPilot],
//         play: [neverLandMermaidLagoon, neverLandMermaidLagoon],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       const firstLocation = testEngine.getCardModel(neverLandMermaidLagoon, 0);
//       const secondLocation = testEngine.getCardModel(neverLandMermaidLagoon, 1);
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [firstLocation] });
//
//       // Only first location should be banished
//       expect(firstLocation.zone).toBe("discard");
//       expect(secondLocation.zone).toBe("play");
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("cannot target characters, only locations", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: launchpadExceptionalPilot.cost,
//           hand: [launchpadExceptionalPilot],
//         },
//         {
//           play: [launchpadExceptionalPilot], // Another character, not a location
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         launchpadExceptionalPilot,
//         0,
//       );
//       const opponentCharacter = testEngine.getCardModel(
//         launchpadExceptionalPilot,
//         1,
//       );
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Ability triggers but has no valid targets (no locations in play), so it's skipped
//       // Both characters should still be in play
//       expect(cardUnderTest.zone).toBe("play");
//       expect(opponentCharacter.zone).toBe("play");
//     });
//   });
//
//   describe("OFF THE MAP - Multiple Locations Scenario", () => {
//     it("allows player to choose which location to banish when multiple are available", async () => {
//       const testEngine = new TestEngine({
//         inkwell: launchpadExceptionalPilot.cost,
//         hand: [launchpadExceptionalPilot],
//         play: [neverLandMermaidLagoon, neverLandMermaidLagoon],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(launchpadExceptionalPilot);
//       const location1 = testEngine.getCardModel(neverLandMermaidLagoon, 0);
//       const location2 = testEngine.getCardModel(neverLandMermaidLagoon, 1);
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//
//       // Choose to banish the second location
//       await testEngine.resolveTopOfStack({ targets: [location2] });
//
//       // Only the chosen location should be banished
//       expect(location1.zone).toBe("play");
//       expect(location2.zone).toBe("discard");
//       expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
