// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { peterPansShadowNotSewnOn } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   PeteSteamboatRival,
//   PeteWrestlingChamp,
//   SimbaAdventurousSuccessor,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pete - Steamboat Rival", () => {
//   Describe("**SCRAM!** When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.", () => {
//     It("Pete in play", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: peteSteamboatRival.cost,
//           Hand: [peteSteamboatRival],
//           Play: [peteWrestlingChamp],
//         },
//         {
//           Play: [simbaAdventurousSuccessor],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(peteSteamboatRival);
//       Const target = testStore.getCard(simbaAdventurousSuccessor);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("discard");
//     });
//
//     It("No Pete in play", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: peteSteamboatRival.cost,
//           Hand: [peteSteamboatRival],
//           Play: [peterPansShadowNotSewnOn],
//         },
//         {
//           Play: [simbaAdventurousSuccessor],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(peteSteamboatRival);
//       Const target = testStore.getCard(simbaAdventurousSuccessor);
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.stackLayers.length).toEqual(0);
//       Expect(target.zone).toEqual("play");
//     });
//   });
// });
//
