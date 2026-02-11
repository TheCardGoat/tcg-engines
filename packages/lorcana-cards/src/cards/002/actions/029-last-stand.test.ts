// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinCorneredSwordman,
//   LiloGalacticHero,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { lastStand } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Last Stand", () => {
//   Describe("Banish chosen character who was challenged this turn.", () => {
//     It("Does NOT Banish a character that has not been challenged", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: lastStand.cost,
//           Hand: [lastStand],
//           Play: [liloGalacticHero],
//         },
//         {
//           Play: [goofyKnightForADay, aladdinCorneredSwordman],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", lastStand.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         AladdinCorneredSwordman.id,
//         "player_two",
//       );
//       Const challenger = testStore.getByZoneAndId("play", liloGalacticHero.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         GoofyKnightForADay.id,
//         "player_two",
//       );
//
//       Target.updateCardMeta({ exerted: true });
//       Challenger.challenge(defender);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("play");
//     });
//
//     It("Does NOT Banish a character that has not been challenged", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: lastStand.cost,
//           Hand: [lastStand],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", lastStand.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         GoofyKnightForADay.id,
//         "player_two",
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("play");
//     });
//
//     It("Banishes a character that has been challenged", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: lastStand.cost,
//           Hand: [lastStand],
//           Play: [liloGalacticHero],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", lastStand.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         GoofyKnightForADay.id,
//         "player_two",
//       );
//       Const challenger = testStore.getByZoneAndId("play", liloGalacticHero.id);
//
//       Target.updateCardMeta({ exerted: true });
//       Challenger.challenge(target);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("discard");
//     });
//   });
// });
//
