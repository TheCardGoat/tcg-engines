// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/027-hakuna-matata";
// Import { clarabelleLightOnHerHooves } from "@lorcanito/lorcana-engine/cards/005/characters/084-clarabelle-light-on-her-hooves";
// Import { allIsFound } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   MickeyMouseBraveLittlePrince,
//   MinnieMouseSweetheartPrincess,
//   UrsulaVoiceStealer,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ursula - Voice Stealer", () => {
//   It("SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ursulaVoiceStealer.cost,
//         Hand: [ursulaVoiceStealer, hakunaMatata],
//       },
//       {
//         Play: [minnieMouseSweetheartPrincess],
//       },
//     );
//
//     Await testEngine.playCard(
//       UrsulaVoiceStealer,
//       {
//         AcceptOptionalLayer: true,
//         Targets: [minnieMouseSweetheartPrincess],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(minnieMouseSweetheartPrincess).ready).toBe(
//       False,
//     );
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [hakunaMatata] });
//     Expect(testEngine.getCardModel(hakunaMatata).zone).toBe("discard");
//   });
//
//   Describe("Regression", () => {
//     It("Clarabelle interaction", async () => {
//       Const targets = [
//         MinnieMouseSweetheartPrincess,
//         MickeyMouseBraveLittlePrince,
//       ];
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: ursulaVoiceStealer.cost,
//           Hand: [ursulaVoiceStealer, allIsFound],
//           Discard: targets,
//         },
//         {
//           Play: [clarabelleLightOnHerHooves],
//         },
//       );
//
//       Await testEngine.playCard(
//         UrsulaVoiceStealer,
//         {
//           Targets: [clarabelleLightOnHerHooves],
//           AcceptOptionalLayer: true,
//         },
//         True,
//       );
//
//       Expect(testEngine.getCardModel(clarabelleLightOnHerHooves).ready).toBe(
//         False,
//       );
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [allIsFound] }, true);
//       Expect(testEngine.getCardModel(allIsFound).zone).toBe("discard");
//
//       Await testEngine.resolveTopOfStack({ targets: targets });
//
//       For (const target of targets) {
//         // "Put up to 2 cards from your discard into your inkwell, facedown and exerted."
//         Expect(testEngine.getCardModel(target).zone).toBe("inkwell");
//       }
//     });
//   });
// });
//
