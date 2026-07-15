// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { bounce } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bounce", () => {
//   It("Return chosen character of yours to your hand to return another chosen character to their player's hand.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: bounce.cost,
//         Hand: [bounce],
//         Play: [cinderellaBallroomSensation],
//       },
//       {
//         Play: [liloGalacticHero],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", bounce.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       CinderellaBallroomSensation.id,
//     );
//     Const opponentTarget = testStore.getByZoneAndId(
//       "play",
//       LiloGalacticHero.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] }, true);
//     TestStore.resolveTopOfStack({ targets: [opponentTarget] });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(opponentTarget.zone).toEqual("hand");
//   });
// });
//
