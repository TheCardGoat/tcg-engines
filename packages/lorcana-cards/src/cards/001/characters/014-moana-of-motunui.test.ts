// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CinderellaGentleAndKind,
//   JohnSilverAlienPirate,
//   MoanaOfMotunui,
//   RapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/027-hakuna-matata";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Moana Of Motunui", () => {
//   Describe("We Can Fix It", () => {
//     It("Ready All OTHER Princess", () => {
//       Const testStore = new TestStore({
//         Play: [
//           MoanaOfMotunui,
//           CinderellaGentleAndKind,
//           RapunzelGiftedWithHealing,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         CinderellaGentleAndKind.id,
//       );
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         RapunzelGiftedWithHealing.id,
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: false });
//       Target.updateCardMeta({ exerted: true });
//       AnotherTarget.updateCardMeta({ exerted: true });
//
//       Expect(testStore.getByZoneAndId("play", moanaOfMotunui.id).meta).toEqual(
//         Expect.objectContaining({ exerted: false }),
//       );
//
//       CardUnderTest.quest();
//       TestStore.resolveOptionalAbility();
//
//       Expect(target.meta).toEqual(expect.objectContaining({ exerted: false }));
//       Expect(anotherTarget.meta).toEqual(
//         Expect.objectContaining({ exerted: false }),
//       );
//       Expect(cardUnderTest.meta).toEqual(
//         Expect.objectContaining({ exerted: true }),
//       );
//     });
//
//     It("Should ready only princesses", () => {
//       Const testStore = new TestStore({
//         Play: [
//           MoanaOfMotunui,
//           CinderellaGentleAndKind,
//           RapunzelGiftedWithHealing,
//           JohnSilverAlienPirate,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         CinderellaGentleAndKind.id,
//       );
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         RapunzelGiftedWithHealing.id,
//       );
//       Const shouldNoBeTarget = testStore.getByZoneAndId(
//         "play",
//         JohnSilverAlienPirate.id,
//       );
//       CardUnderTest.updateCardMeta({ exerted: false });
//       Target.updateCardMeta({ exerted: true });
//       AnotherTarget.updateCardMeta({ exerted: true });
//       ShouldNoBeTarget.updateCardMeta({ exerted: true });
//       Expect(testStore.getByZoneAndId("play", moanaOfMotunui.id).meta).toEqual(
//         Expect.objectContaining({ exerted: false }),
//       );
//
//       CardUnderTest.quest();
//
//       TestStore.resolveTopOfStack();
//
//       Expect(
//         TestStore.getByZoneAndId("play", cinderellaGentleAndKind.id).meta,
//       ).toEqual(expect.objectContaining({ exerted: false }));
//       Expect(
//         TestStore.getByZoneAndId("play", rapunzelGiftedWithHealing.id).meta,
//       ).toEqual(expect.objectContaining({ exerted: false }));
//       Expect(
//         TestStore.getByZoneAndId("play", johnSilverAlienPirate.id).meta,
//       ).toEqual(expect.objectContaining({ exerted: true }));
//     });
//   });
//
//   Describe("Regression", () => {
//     It("Readied princess are unable to sing", async () => {
//       Const testEngine = new TestEngine({
//         Play: [moanaOfMotunui, cinderellaGentleAndKind],
//         Hand: [hakunaMatata],
//       });
//
//       Await testEngine.tapCard(cinderellaGentleAndKind);
//       Await testEngine.questCard(moanaOfMotunui);
//
//       Await testEngine.acceptOptionalLayer();
//
//       Await testEngine.singSong({
//         Singer: cinderellaGentleAndKind,
//         Song: hakunaMatata,
//       });
//
//       Expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
//       Expect(testEngine.getCardModel(cinderellaGentleAndKind).ready).toEqual(
//         False,
//       );
//     });
//   });
// });
//
