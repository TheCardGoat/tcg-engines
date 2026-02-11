// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { kenaiBigBrother } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { brawl } from "../../004/actions/130-brawl";
// Import { kodaSmallishBear } from "../../007";
// Import {
//   CharlotteLaBouffMardiGrasPrincess,
//   DeweyLovableShowoff,
// } from "../../008";
//
// Describe("Kenai - Big Brother", () => {
//   It("**BROTHERS FOREVER** While this character is exerted, your characters named Koda can’t be challenged.", () => {
//     Const testStore = new TestEngine(
//       {
//         Inkwell: kenaiBigBrother.cost,
//         Play: [
//           KenaiBigBrother,
//           KodaSmallishBear,
//           CharlotteLaBouffMardiGrasPrincess,
//         ],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCardModel(kenaiBigBrother);
//     Const coda = testStore.getCardModel(kodaSmallishBear);
//     Const oppoCard = testStore.getCardModel(deweyLovableShowoff);
//     Const charlotte = testStore.getCardModel(charlotteLaBouffMardiGrasPrincess);
//
//     CardUnderTest.exert();
//     Coda.exert();
//     Charlotte.exert();
//
//     Expect(cardUnderTest.exerted).toBe(true);
//     Expect(coda.exerted).toBe(true);
//
//     TestStore.passTurn();
//
//     Expect(coda.canBeChallenged(oppoCard)).toBe(false);
//     Expect(charlotte.canBeChallenged(oppoCard)).toBe(true);
//
//     TestStore.challenge({
//       Attacker: oppoCard,
//       Defender: coda,
//     });
//
//     Expect(coda.zone).toEqual("play");
//
//     TestStore.challenge({
//       Attacker: oppoCard,
//       Defender: charlotte,
//     });
//
//     Expect(charlotte.zone).toEqual("discard");
//   });
//
//   It("**BROTHERS FOREVER** While this character is exerted, your characters named Koda can’t be challenged. But if Kenai will be banished, koda can be challenged.", async () => {
//     Const testStore = new TestEngine(
//       {
//         Inkwell: kenaiBigBrother.cost,
//         Play: [
//           KenaiBigBrother,
//           KodaSmallishBear,
//           CharlotteLaBouffMardiGrasPrincess,
//         ],
//       },
//       {
//         Inkwell: brawl.cost,
//         Hand: [brawl],
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCardModel(kenaiBigBrother);
//     Const coda = testStore.getCardModel(kodaSmallishBear);
//     Const oppoCard = testStore.getCardModel(deweyLovableShowoff);
//     Const charlotte = testStore.getCardModel(charlotteLaBouffMardiGrasPrincess);
//
//     CardUnderTest.exert();
//     Coda.exert();
//     Charlotte.exert();
//
//     Expect(cardUnderTest.exerted).toBe(true);
//     Expect(coda.exerted).toBe(true);
//
//     TestStore.passTurn();
//
//     Expect(coda.canBeChallenged(oppoCard)).toBe(false);
//     Expect(charlotte.canBeChallenged(oppoCard)).toBe(true);
//
//     TestStore.playCard(brawl);
//     TestStore.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     Expect(cardUnderTest.zone).toEqual("discard");
//     Expect(coda.zone).toEqual("play");
//     Expect(charlotte.zone).toEqual("play");
//
//     Expect(coda.canBeChallenged(oppoCard)).toBe(true);
//     Expect(charlotte.canBeChallenged(oppoCard)).toBe(true);
//   });
// });
//
