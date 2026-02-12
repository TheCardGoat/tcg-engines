// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielSingingMermaid } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { pennyBoltsPerson } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Penny - Bolt's Person", () => {
//   Describe("ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", () => {
//     It("Heal and Resist", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: pennyBoltsPerson.cost,
//         Hand: [pennyBoltsPerson],
//         Play: [arielSingingMermaid],
//       });
//
//       Const target = testEngine.getCardModel(arielSingingMermaid);
//       Target.updateCardDamage(2, "add");
//       Expect(target.meta.damage).toEqual(2);
//
//       Await testEngine.playCard(pennyBoltsPerson);
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//       Const cardUnderTest = testEngine.getCardModel(pennyBoltsPerson);
//
//       Expect(target.meta.damage).toEqual(0);
//       Expect(target.hasResist).toBe(true);
//     });
//   });
// });
//
