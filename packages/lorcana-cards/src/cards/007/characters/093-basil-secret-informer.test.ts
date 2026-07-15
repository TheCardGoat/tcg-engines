// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tinkerBellGiantFairy } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { beastTragicHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { basilSecretInformer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)", () => {
//   It("should give Reckless to damaged opposing characters, when questing", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 10,
//         Play: [basilSecretInformer],
//         Hand: [letTheStormRageOn],
//       },
//       {
//         Inkwell: 10,
//         Play: [beastTragicHero, tinkerBellGiantFairy],
//         Hand: [],
//       },
//     );
//
//     /*await testEngine.playCard(
//       LetTheStormRageOn,
//       {
//         Targets: [beastTragicHero],
//       },
//       True,
//     );*/
//
//     Expect(testEngine.getCardModel(beastTragicHero).hasReckless).toBe(false);
//     Expect(testEngine.getCardModel(tinkerBellGiantFairy).hasReckless).toBe(
//       False,
//     );
//
//     TestEngine.getCardModel(beastTragicHero).updateCardDamage(2, "add");
//
//     Expect(testEngine.getCardModel(beastTragicHero).damage).toEqual(2);
//
//     Await testEngine.questCard(basilSecretInformer);
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(beastTragicHero).hasReckless).toBe(true);
//     Expect(testEngine.getCardModel(tinkerBellGiantFairy).hasReckless).toBe(
//       False,
//     );
//   });
// });
//
