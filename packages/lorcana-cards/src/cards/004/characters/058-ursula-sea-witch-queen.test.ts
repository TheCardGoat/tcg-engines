// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { partOfYourWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   DiabloMaleficentsSpy,
//   UrsulaSeaWitchQueen,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula - Sea Witch Queen", () => {
//   It("**NOW I'M THE RULER** Whenever this character quests, exert chosen character.", () => {
//     Const testStore = new TestStore({
//       Play: [ursulaSeaWitchQueen, diabloMaleficentsSpy],
//     });
//
//     Const cardUnderTest = testStore.getCard(ursulaSeaWitchQueen);
//     Const target = testStore.getCard(diabloMaleficentsSpy);
//
//     Expect(target.meta.exerted).toBeFalsy();
//     CardUnderTest.quest();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.meta.exerted).toBe(true);
//   });
//
//   Describe("**YOU'LL LISTEN TO ME!**", () => {
//     It("Other characters can't exert to sing songs.", () => {
//       Const testStore = new TestStore({
//         Play: [ursulaSeaWitchQueen, cinderellaBallroomSensation],
//         Hand: [partOfYourWorld],
//       });
//
//       Const songToSing = testStore.getCard(partOfYourWorld);
//       Const cardToSing = testStore.getCard(cinderellaBallroomSensation);
//
//       Expect(cardToSing.ready).toEqual(true);
//       Expect(cardToSing.meta.playedThisTurn).toBeFalsy();
//
//       CardToSing.sing(songToSing);
//
//       Expect(cardToSing.ready).toEqual(true);
//       Expect(testStore.getZonesCardCount().hand).toEqual(1);
//       Expect(testStore.getZonesCardCount().play).toEqual(2);
//     });
//
//     It("She's able to sing", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ursulaSeaWitchQueen],
//         Discard: [cinderellaBallroomSensation],
//         Hand: [partOfYourWorld],
//       });
//
//       Const { singer, song } = await testEngine.singSong({
//         Song: partOfYourWorld,
//         Singer: cinderellaBallroomSensation,
//       });
//
//       Expect(singer.ready).toEqual(false);
//       Expect(song.zone).toEqual("discard");
//     });
//   });
// });
//
