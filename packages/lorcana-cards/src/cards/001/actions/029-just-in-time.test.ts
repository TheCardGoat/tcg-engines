// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { justInTime } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   CaptainColonelsLieutenant,
//   SimbaProtectiveCub,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Just in Time", () => {
//   Describe("Costs <= 5", () => {
//     It("Plays character card for free", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: justInTime.cost,
//         Hand: [justInTime, captainColonelsLieutenant],
//       });
//
//       Await testEngine.playCard(justInTime, {
//         AcceptOptionalLayer: true,
//         Targets: [captainColonelsLieutenant],
//       });
//
//       Expect(testEngine.getCardModel(justInTime).zone).toEqual("discard");
//       Expect(testEngine.getCardModel(captainColonelsLieutenant).zone).toEqual(
//         "play",
//       );
//     });
//
//     It("Characters with Bodyguard can be played exerted", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: justInTime.cost,
//         Hand: [justInTime, simbaProtectiveCub],
//       });
//
//       Await testEngine.playCard(
//         JustInTime,
//         {
//           AcceptOptionalLayer: true,
//           Targets: [simbaProtectiveCub],
//         },
//         True,
//       );
//       Expect(testEngine.getCardModel(simbaProtectiveCub).zone).toEqual("play");
//       Expect(testEngine.getCardModel(simbaProtectiveCub).exerted).toEqual(
//         False,
//       );
//
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getCardModel(simbaProtectiveCub).exerted).toEqual(true);
//     });
//
//     It("Characters with Bodyguard can be played ready", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: justInTime.cost,
//         Hand: [justInTime, simbaProtectiveCub],
//       });
//
//       Await testEngine.playCard(
//         JustInTime,
//         {
//           AcceptOptionalLayer: true,
//           Targets: [simbaProtectiveCub],
//         },
//         True,
//       );
//       Expect(testEngine.getCardModel(simbaProtectiveCub).zone).toEqual("play");
//       Expect(testEngine.getCardModel(simbaProtectiveCub).exerted).toEqual(
//         False,
//       );
//
//       Await testEngine.skipTopOfStack();
//
//       Expect(testEngine.getCardModel(simbaProtectiveCub).exerted).toEqual(
//         False,
//       );
//     });
//   });
//
//   Describe("Costs > 5", () => {
//     It("Doesn't play for free", () => {
//       Const testStore = new TestStore({
//         Inkwell: justInTime.cost,
//         Hand: [justInTime, teKaTheBurningOne],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", justInTime.id);
//       Const target = testStore.getByZoneAndId("hand", teKaTheBurningOne.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       Expect(cardUnderTest.zone).toEqual("discard");
//
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//       Expect(target.zone).toEqual("hand");
//
//       // TODO: We still have to decide what to do with the stack, when there's no valid target.
//       // Ideally we should not be able to play the card, but this would require to check valid targets before playing the card
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It.skip("Doesn't shift character card for free", () => {
//       Throw new Error("Not implemented");
//     });
//   });
// });
//
