// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GrumpyBadTempered,
//   HappyGoodNatured,
//   SleepyNoddingOff,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Grumpy - Bad-Tempered", () => {
//   It("**THERE'S TROUBLE A-BREWIN'** Your other Seven Dwarfs characters get +1 {S}.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: grumpyBadTempered.cost,
//         Play: [grumpyBadTempered, sleepyNoddingOff, happyGoodNatured],
//       },
//       { deck: 1 },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       GrumpyBadTempered.id,
//     );
//     Const sleepy = testStore.getByZoneAndId("play", sleepyNoddingOff.id);
//     Const happy = testStore.getByZoneAndId("play", happyGoodNatured.id);
//
//     Expect(cardUnderTest.strength).toEqual(grumpyBadTempered.strength);
//     Expect(sleepy.strength).toEqual(sleepyNoddingOff.strength + 1);
//     Expect(happy.strength).toEqual(happyGoodNatured.strength + 1);
//
//     TestStore.passTurn();
//
//     Expect(cardUnderTest.strength).toEqual(grumpyBadTempered.strength);
//     Expect(sleepy.strength).toEqual(sleepyNoddingOff.strength + 1);
//     Expect(happy.strength).toEqual(happyGoodNatured.strength + 1);
//   });
// });
//
