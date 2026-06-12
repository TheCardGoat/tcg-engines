// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BelleStrangeButBeautiful,
//   GoonsMaleficent,
//   MauiDemiGod,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MauiHalfshark,
//   RayaKumandranRider,
//   YokaiProfessorCallaghan,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Raya - Kumandran Rider", () => {
//   It("can't ready itself", async () => {
//     Const testEngine = new TestEngine({
//       Play: [rayaKumandranRider, mauiHalfshark, mauiDemiGod],
//       Hand: [goonsMaleficent, yokaiProfessorCallaghan],
//     });
//
//     Await testEngine.tapCard(mauiHalfshark); // Card to untap
//     Await testEngine.tapCard(rayaKumandranRider); // Card that should not be untapped
//
//     Await testEngine.putIntoInkwell(goonsMaleficent);
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [rayaKumandranRider] }, true);
//     Expect(testEngine.getCardModel(rayaKumandranRider).meta.exerted).toBe(true);
//     Expect(testEngine.stackLayers).toHaveLength(1);
//   });
//
//   It("Doesn't trigger on opponent's turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [mauiDemiGod],
//         Hand: [goonsMaleficent],
//       },
//       {
//         Play: [rayaKumandranRider, mauiHalfshark],
//       },
//     );
//
//     Await testEngine.tapCard(mauiHalfshark);
//     Await testEngine.tapCard(mauiDemiGod);
//
//     Await testEngine.putIntoInkwell(goonsMaleficent);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
//
//   It("COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.", async () => {
//     Const testStore = new TestStore({
//       Play: [rayaKumandranRider, mauiHalfshark],
//       Hand: [goonsMaleficent],
//     });
//     Const cardToUnexert = testStore.getCard(mauiHalfshark);
//     CardToUnexert.updateCardMeta({ exerted: true });
//     Const cardToInk = testStore.getCard(goonsMaleficent);
//     CardToInk.addToInkwell();
//     Expect(testStore.stackLayers).toHaveLength(1);
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [cardToUnexert] }, true);
//     Expect(cardToUnexert.meta.exerted).toBe(false);
//   });
//
//   It("can't do it twice", async () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         RayaKumandranRider,
//         MauiHalfshark,
//         MauiDemiGod,
//         BelleStrangeButBeautiful,
//       ],
//       Hand: [goonsMaleficent, yokaiProfessorCallaghan],
//     });
//
//     Await testEngine.tapCard(mauiHalfshark); // Card to untap
//     Await testEngine.tapCard(mauiDemiGod); // Card that should not be untapped
//
//     Await testEngine.putIntoInkwell(goonsMaleficent);
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [mauiHalfshark] });
//     Expect(testEngine.getCardModel(mauiHalfshark).meta.exerted).toBe(false);
//     Expect(testEngine.getCardModel(mauiHalfshark).canQuest).toBe(false);
//
//     Await testEngine.putIntoInkwell(yokaiProfessorCallaghan);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
