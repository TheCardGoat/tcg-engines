// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   grumpySkepticalKnight,
//   happyLivelyKnight,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { cursedMerfolkUrsulasHandiwork } from "../../003/characters/characters";
// import { sevenDwarfsMineSecureFortress } from "../locations/204-seven-dwarfs-mine-secure-fortress";
//
// describe("Grumpy - Skeptical Knight", () => {
//   it("**BOON OF RESILIENCE** While one of your Knight characters is at a location, that character gains Resist +2. _(Damage dealt to them is reduced by 2)._", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 8,
//       play: [
//         grumpySkepticalKnight,
//         happyLivelyKnight,
//         sevenDwarfsMineSecureFortress,
//         cursedMerfolkUrsulasHandiwork,
//       ],
//     });
//
//     expect(testEngine.getCardModel(grumpySkepticalKnight).hasResist).toBe(
//       false,
//     );
//
//     await testEngine.moveToLocation({
//       location: sevenDwarfsMineSecureFortress,
//       character: happyLivelyKnight,
//     });
//     await testEngine.skipTopOfStack();
//
//     expect(testEngine.getCardModel(happyLivelyKnight).hasResist).toBe(true);
//
//     await testEngine.moveToLocation({
//       location: sevenDwarfsMineSecureFortress,
//       character: grumpySkepticalKnight,
//     });
//
//     expect(testEngine.getCardModel(grumpySkepticalKnight).hasResist).toBe(true);
//
//     await testEngine.moveToLocation({
//       location: sevenDwarfsMineSecureFortress,
//       character: cursedMerfolkUrsulasHandiwork,
//     });
//
//     expect(
//       testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).hasResist,
//     ).toBe(false);
//   });
//
//   it("**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: grumpySkepticalKnight.cost,
//       play: [grumpySkepticalKnight],
//     });
//
//     expect(testEngine.getCardModel(grumpySkepticalKnight).hasEvasive).toBe(
//       true,
//     );
//     await testEngine.passTurn();
//     expect(testEngine.getCardModel(grumpySkepticalKnight).hasEvasive).toBe(
//       false,
//     );
//   });
// });
//
