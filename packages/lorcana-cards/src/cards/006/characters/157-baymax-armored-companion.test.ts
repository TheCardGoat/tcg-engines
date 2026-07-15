// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BaymaxArmoredCompanion,
//   HiroHamadaTeamLeader,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baymax - Armored Companion", () => {
//   It("**THE TREATMENT IS WORKING** When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [baymaxArmoredCompanion, hiroHamadaTeamLeader],
//     });
//
//     Const targetCard = await testEngine.setCardDamage(hiroHamadaTeamLeader, 4);
//
//     Expect(testEngine.getPlayerLore()).toBe(0);
//
//     Await testEngine.questCard(baymaxArmoredCompanion);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [targetCard],
//     });
//
//     Expect(targetCard.damage).toBe(2);
//
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//     Expect(testEngine.getPlayerLore("player_one")).toBe(4);
//   });
// });
//
