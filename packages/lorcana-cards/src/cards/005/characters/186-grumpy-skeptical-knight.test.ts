// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GrumpySkepticalKnight,
//   HappyLivelyKnight,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { cursedMerfolkUrsulasHandiwork } from "../../003/characters/characters";
// Import { sevenDwarfsMineSecureFortress } from "../locations/204-seven-dwarfs-mine-secure-fortress";
//
// Describe("Grumpy - Skeptical Knight", () => {
//   It("**BOON OF RESILIENCE** While one of your Knight characters is at a location, that character gains Resist +2. _(Damage dealt to them is reduced by 2)._", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 8,
//       Play: [
//         GrumpySkepticalKnight,
//         HappyLivelyKnight,
//         SevenDwarfsMineSecureFortress,
//         CursedMerfolkUrsulasHandiwork,
//       ],
//     });
//
//     Expect(testEngine.getCardModel(grumpySkepticalKnight).hasResist).toBe(
//       False,
//     );
//
//     Await testEngine.moveToLocation({
//       Location: sevenDwarfsMineSecureFortress,
//       Character: happyLivelyKnight,
//     });
//     Await testEngine.skipTopOfStack();
//
//     Expect(testEngine.getCardModel(happyLivelyKnight).hasResist).toBe(true);
//
//     Await testEngine.moveToLocation({
//       Location: sevenDwarfsMineSecureFortress,
//       Character: grumpySkepticalKnight,
//     });
//
//     Expect(testEngine.getCardModel(grumpySkepticalKnight).hasResist).toBe(true);
//
//     Await testEngine.moveToLocation({
//       Location: sevenDwarfsMineSecureFortress,
//       Character: cursedMerfolkUrsulasHandiwork,
//     });
//
//     Expect(
//       TestEngine.getCardModel(cursedMerfolkUrsulasHandiwork).hasResist,
//     ).toBe(false);
//   });
//
//   It("**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: grumpySkepticalKnight.cost,
//       Play: [grumpySkepticalKnight],
//     });
//
//     Expect(testEngine.getCardModel(grumpySkepticalKnight).hasEvasive).toBe(
//       True,
//     );
//     Await testEngine.passTurn();
//     Expect(testEngine.getCardModel(grumpySkepticalKnight).hasEvasive).toBe(
//       False,
//     );
//   });
// });
//
