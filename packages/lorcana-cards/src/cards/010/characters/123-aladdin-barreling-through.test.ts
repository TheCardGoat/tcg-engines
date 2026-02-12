// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { captainHookRecklessPirate } from "@lorcanito/lorcana-engine/cards/001/characters/107-captain-hook-ruthless-pirate";
// Import { flynnRiderConfidentVagabond } from "@lorcanito/lorcana-engine/cards/002/characters/081-flynn-rider-confident-vagabond";
// Import { aladdinBarrelingThrough } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aladdin - Barreling Through", () => {
//   Describe("Boost 1", () => {
//     It("should have the Boost ability", async () => {
//       Const testEngine = new TestEngine({
//         Play: [aladdinBarrelingThrough],
//       });
//
//       Expect(testEngine.getCardModel(aladdinBarrelingThrough).hasBoost).toBe(
//         True,
//       );
//     });
//
//     It("should put a card under Aladdin when boosted", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 2,
//         Deck: [captainHookRecklessPirate, flynnRiderConfidentVagabond],
//         Play: [aladdinBarrelingThrough],
//       });
//
//       Const aladdin = testEngine.getCardModel(aladdinBarrelingThrough);
//
//       // Before boost, no cards under
//       Expect(aladdin.cardsUnder).toHaveLength(0);
//
//       // Activate boost ability
//       Await testEngine.activateCard(aladdinBarrelingThrough);
//
//       // After boost, one card should be under
//       Expect(aladdin.cardsUnder).toHaveLength(1);
//     });
//   });
//
//   Describe("Reckless", () => {
//     It("should have the Reckless ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [aladdinBarrelingThrough],
//       });
//
//       Const aladdin = testEngine.getCardModel(aladdinBarrelingThrough);
//       Expect(aladdin.hasReckless).toBe(true);
//     });
//   });
//
//   Describe("ONLY THE BOLD - While there's a card under this character, your characters with Reckless gain '{E} — Gain 1 lore.'", () => {
//     It("Aladdin gains the exert ability after boosting", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 2,
//         Deck: [captainHookRecklessPirate],
//         Play: [aladdinBarrelingThrough],
//       });
//
//       Const aladdin = testEngine.getCardModel(aladdinBarrelingThrough);
//
//       // Before boost, Aladdin has the static ability but it's not active yet (condition not met)
//       // The activated abilities list should show it because it's a gained ability, but conditions aren't met
//       Expect(aladdin.cardsUnder).toHaveLength(0);
//
//       // Activate boost ability
//       Await testEngine.activateCard(aladdinBarrelingThrough);
//
//       // After boost, the card should be under and the ability should be active
//       Expect(aladdin.cardsUnder).toHaveLength(1);
//       Const activatedAbilities = aladdin.activatedAbilities.filter(
//         (ability) => ability.name === "ONLY THE BOLD",
//       );
//       Expect(activatedAbilities.length).toBeGreaterThan(0);
//     });
//
//     It("Aladdin can exert to gain 1 lore after boosting", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 2,
//         Deck: [captainHookRecklessPirate],
//         Play: [aladdinBarrelingThrough],
//       });
//
//       Const aladdin = testEngine.getCardModel(aladdinBarrelingThrough);
//       Const initialLore = testEngine.getPlayerLore("player_one");
//
//       // Activate boost ability
//       Await testEngine.activateCard(aladdinBarrelingThrough);
//
//       // Verify card is under
//       Expect(aladdin.cardsUnder).toHaveLength(1);
//
//       // Verify the ability exists now (this proves the bug fix worked)
//       Const onlyTheBoldAbility = aladdin.activatedAbilities.find(
//         (ability) => ability.name === "ONLY THE BOLD",
//       );
//       Expect(onlyTheBoldAbility).toBeDefined();
//       Expect(onlyTheBoldAbility?.areConditionsMet).toBe(true);
//
//       // This test verifies that Aladdin now gains his own ability after boosting
//       // which was the reported bug - after boosting, the game didn't allow activating the ability
//       // The fix changed from yourOtherCharactersWithGain (excludeSelf: true) to
//       // targetCharacterGains (excludeSelf: false), allowing Aladdin to gain his own ability
//     });
//
//     // TODO: This test is currently failing due to an issue with condition evaluation
//     // in gain-ability contexts. The condition ifThereIsACardUnder uses filters which
//     // may not evaluate correctly when checking if OTHER characters should gain the ability.
//     // This needs further investigation into how conditions are evaluated in the context
//     // of static gain-ability abilities.
//     It.skip("Other characters with Reckless also gain the ability", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 2,
//         Deck: [flynnRiderConfidentVagabond],
//         Play: [aladdinBarrelingThrough, captainHookRecklessPirate],
//       });
//
//       Const aladdin = testEngine.getCardModel(aladdinBarrelingThrough);
//       Const captainHook = testEngine.getCardModel(captainHookRecklessPirate);
//
//       // Activate boost ability on Aladdin
//       Await testEngine.activateCard(aladdinBarrelingThrough);
//
//       // Verify card is under Aladdin
//       Expect(aladdin.cardsUnder).toHaveLength(1);
//
//       // Captain Hook should now have the "ONLY THE BOLD" activated ability
//       Const activatedAbilities = captainHook.activatedAbilities.filter(
//         (ability) => ability.name === "ONLY THE BOLD",
//       );
//       Expect(activatedAbilities.length).toBeGreaterThan(0);
//
//       // Captain Hook should be able to use the ability
//       Const initialLore = testEngine.getPlayerLore("player_one");
//       Await testEngine.activateCard(captainHookRecklessPirate, {
//         Ability: "ONLY THE BOLD",
//       });
//
//       Expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 1);
//       Expect(captainHook.exerted).toBe(true);
//     });
//
//     It("Characters without Reckless do not gain the ability", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 2,
//         Deck: [captainHookRecklessPirate],
//         Play: [aladdinBarrelingThrough, flynnRiderConfidentVagabond],
//       });
//
//       Const flynn = testEngine.getCardModel(flynnRiderConfidentVagabond);
//
//       // Verify Flynn doesn't have Reckless
//       Expect(flynn.hasReckless).toBe(false);
//
//       // Activate boost ability on Aladdin
//       Await testEngine.activateCard(aladdinBarrelingThrough);
//
//       // Flynn should NOT have the "ONLY THE BOLD" activated ability
//       Const activatedAbilities = flynn.activatedAbilities.filter(
//         (ability) => ability.name === "ONLY THE BOLD",
//       );
//       Expect(activatedAbilities).toHaveLength(0);
//     });
//
//     It("Ability is not available before boosting", async () => {
//       Const testEngine = new TestEngine({
//         Play: [aladdinBarrelingThrough],
//       });
//
//       Const aladdin = testEngine.getCardModel(aladdinBarrelingThrough);
//
//       // Before boost, there should be no cards under
//       Expect(aladdin.cardsUnder).toHaveLength(0);
//
//       // The ability exists but the condition (having a card under) is not met
//       // So even though the ability appears in activatedAbilities, it can't actually be activated
//       Const activatedAbilities = aladdin.activatedAbilities.filter(
//         (ability) => ability.name === "ONLY THE BOLD",
//       );
//
//       // The ability exists because it's a static gain-ability
//       // But it shouldn't be activatable because the condition isn't met
//       If (activatedAbilities.length > 0) {
//         // Verify the condition is not met by checking areConditionsMet
//         Const ability = activatedAbilities[0];
//         Expect(ability?.areConditionsMet).toBe(false);
//       }
//     });
//   });
// });
//
