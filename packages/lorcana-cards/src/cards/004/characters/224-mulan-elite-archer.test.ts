// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mcduckManorScroogesMansion } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import {
//   CinderellaMelodyWeaver,
//   MulanEliteArcher,
//   MulanInjuredSoldier,
//   PeteRottenGuy,
//   PlutoRescueDog,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mulan - Elite Archer", () => {
//   It("**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Mulan.)_", () => {
//     Const testStore = new TestStore({
//       Play: [mulanEliteArcher],
//     });
//
//     Const cardUnderTest = testStore.getCard(mulanEliteArcher);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("**STRAIGHT SHOOTER** When you play this character, if you used **Shift** to play her, she gets +3 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mulanEliteArcher.cost,
//       Hand: [mulanEliteArcher],
//       Play: [mulanInjuredSoldier],
//     });
//
//     Const shifter = testStore.getCard(mulanEliteArcher);
//     Const shifted = testStore.getCard(mulanInjuredSoldier);
//
//     Shifter.shift(shifted);
//
//     Expect(shifter.strength).toBe(mulanEliteArcher.strength + 3);
//   });
//
//   Describe("**TRIPLE SHOT** During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.", () => {
//     It("During your turn", async () => {
//       Const opponentsPlayCard = [
//         CinderellaMelodyWeaver,
//         PlutoRescueDog,
//         PeteRottenGuy,
//       ];
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: mulanEliteArcher.cost,
//           Play: [mulanEliteArcher],
//         },
//         {
//           Play: opponentsPlayCard,
//         },
//       );
//
//       Await testEngine.challenge({
//         Attacker: mulanEliteArcher,
//         Defender: cinderellaMelodyWeaver,
//         ExertDefender: true,
//       });
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [plutoRescueDog, peteRottenGuy],
//         },
//         True,
//       );
//
//       OpponentsPlayCard.forEach((target) => {
//         Expect(testEngine.getCardModel(target).damage).toBe(
//           MulanEliteArcher.strength,
//         );
//       });
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     It("During your turn, does NOT trigger on locations", async () => {
//       Const opponentsPlayCard = [
//         McduckManorScroogesMansion,
//         PlutoRescueDog,
//         PeteRottenGuy,
//       ];
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: mulanEliteArcher.cost,
//           Play: [mulanEliteArcher],
//         },
//         {
//           Play: opponentsPlayCard,
//         },
//       );
//
//       Await testEngine.challenge({
//         Attacker: mulanEliteArcher,
//         Defender: mcduckManorScroogesMansion,
//         ExertDefender: true,
//       });
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     It("During opponent's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [cinderellaMelodyWeaver],
//         },
//         {
//           Play: [mulanEliteArcher],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(mulanEliteArcher);
//       Const attacker = testEngine.getCardModel(cinderellaMelodyWeaver);
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
