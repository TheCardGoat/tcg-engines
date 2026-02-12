// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { baBoom } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { scroogeMcduckUncleMoneybags } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { vaultDoor } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { mcduckManorScroogesMansion } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vault Door", () => {
//   It("Your locations gain **Resist** +1", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: baBoom.cost,
//       Play: [
//         VaultDoor,
//         McduckManorScroogesMansion,
//         ScroogeMcduckUncleMoneybags,
//       ],
//       Hand: [baBoom],
//     });
//
//     Const location = testEngine.getCardModel(mcduckManorScroogesMansion);
//     Const damageAction = testEngine.getCardModel(baBoom);
//
//     DamageAction.playFromHand();
//     Await testEngine.resolveTopOfStack({ targets: [location] });
//
//     Expect(location.damage).toBe(1);
//   });
//   It("Your characters at locations gain **Resist** +1", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: baBoom.cost + mcduckManorScroogesMansion.moveCost,
//       Play: [
//         VaultDoor,
//         McduckManorScroogesMansion,
//         ScroogeMcduckUncleMoneybags,
//       ],
//       Hand: [baBoom],
//     });
//
//     Const location = testEngine.getCardModel(mcduckManorScroogesMansion);
//     Const character = testEngine.getCardModel(scroogeMcduckUncleMoneybags);
//     Const damageAction = testEngine.getCardModel(baBoom);
//
//     Await testEngine.moveToLocation({ location, character });
//
//     DamageAction.playFromHand();
//     Await testEngine.resolveTopOfStack({ targets: [character] });
//
//     Expect(character.damage).toBe(1);
//   });
//
//   It("Your characters outside locations DONT gain **Resist** +1", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: baBoom.cost,
//       Play: [
//         VaultDoor,
//         McduckManorScroogesMansion,
//         ScroogeMcduckUncleMoneybags,
//       ],
//       Hand: [baBoom],
//     });
//
//     Const character = testEngine.getCardModel(scroogeMcduckUncleMoneybags);
//     Const damageAction = testEngine.getCardModel(baBoom);
//
//     DamageAction.playFromHand();
//     Await testEngine.resolveTopOfStack({ targets: [character] });
//
//     Expect(character.damage).toBe(2);
//   });
// });
//
