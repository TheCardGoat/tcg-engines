// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BellesHouseMauricesWorkshop,
//   McduckManorScroogesMansion,
// } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { tritonYoungPrince } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { arielsGrottoASecretPlace } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Triton - Young Prince", () => {
//   It("**SUPERIOR SWIMMER** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_**KEEPER OF ATLANTICA** Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tritonYoungPrince.cost,
//       Play: [
//         TritonYoungPrince,
//         ArielsGrottoASecretPlace,
//         McduckManorScroogesMansion,
//       ],
//       Discard: [bellesHouseMauricesWorkshop],
//     });
//
//     Const target = testEngine.getCardModel(arielsGrottoASecretPlace);
//     Const locInPlay = testEngine.getCardModel(mcduckManorScroogesMansion);
//     Const locInDiscard = testEngine.getCardModel(bellesHouseMauricesWorkshop);
//
//     Target.banish();
//     Expect(target.zone).toEqual("discard");
//     Expect(locInPlay.zone).toEqual("play");
//     Expect(locInDiscard.zone).toEqual("discard");
//
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(target.zone).toEqual("inkwell");
//     Expect(locInPlay.zone).toEqual("play");
//     Expect(locInDiscard.zone).toEqual("discard");
//   });
// });
//
