// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mauiHeroToAll } from "@lorcanito/lorcana-engine/cards/001/characters/114-maui-hero-to-all";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import { nextStopOlympus } from "@lorcanito/lorcana-engine/cards/010";
// import { bagheeraCautiousExplorer } from "@lorcanito/lorcana-engine/cards/010/characters/012-bagheera-cautious-explorer";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Next Stop, Olympus", () => {
//   it("cost reduction not active if no character with 5+ strength in play", async () => {
//     const testEngine = new TestEngine({
//       inkwell: nextStopOlympus.cost,
//       hand: [nextStopOlympus],
//       play: [deweyLovableShowoff],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(nextStopOlympus);
//     expect(cardUnderTest.cost).toBe(nextStopOlympus.cost);
//
//     await testEngine.playCard(nextStopOlympus);
//
//     expect(cardUnderTest.zone).toBe("discard");
//     expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(0);
//   });
//
//   it("cost reduction is active if a character with 5+ strength in play", async () => {
//     const testEngine = new TestEngine({
//       hand: [nextStopOlympus],
//       play: [mauiHeroToAll],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(nextStopOlympus);
//     expect(cardUnderTest.cost).toBe(0);
//
//     await testEngine.playCard(nextStopOlympus);
//
//     expect(cardUnderTest.zone).toBe("discard");
//   });
//
//   it("Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: nextStopOlympus.cost,
//         hand: [nextStopOlympus],
//         play: [bagheeraCautiousExplorer],
//       },
//       { play: [deweyLovableShowoff] },
//     );
//
//     const bagheera = testEngine.getCardModel(bagheeraCautiousExplorer);
//     await testEngine.exertCard(bagheera);
//     expect(bagheera.ready).toBe(false);
//
//     // Play Next Stop, Olympus targeting Bagheera
//     await testEngine.playCard(nextStopOlympus);
//     await testEngine.resolveTopOfStack({ targets: [bagheera] });
//
//     // Verify Bagheera is ready
//     expect(bagheera.ready).toBe(true);
//     expect(bagheera.hasQuestRestriction).toBe(true);
//
//     await testEngine.exertCard(deweyLovableShowoff);
//     await testEngine.challenge({
//       attacker: bagheera,
//       defender: deweyLovableShowoff,
//     });
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//   });
//
//   it("only triggers once on the first challenge (not multiple challenges)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: nextStopOlympus.cost,
//         hand: [nextStopOlympus],
//         play: [mauiHeroToAll],
//       },
//       { play: [deweyLovableShowoff, bagheeraCautiousExplorer] },
//     );
//
//     const maui = testEngine.getCardModel(mauiHeroToAll);
//     const dewey = testEngine.getCardModel(deweyLovableShowoff, 1);
//     const bagheera = testEngine.getCardModel(bagheeraCautiousExplorer, 1);
//
//     await testEngine.exertCard(maui);
//     expect(maui.ready).toBe(false);
//
//     // Play Next Stop, Olympus targeting Maui
//     await testEngine.playCard(nextStopOlympus);
//     await testEngine.resolveTopOfStack({ targets: [maui] });
//
//     // Verify Maui is ready and has restrictions
//     expect(maui.ready).toBe(true);
//     expect(maui.hasQuestRestriction).toBe(true);
//
//     // First challenge - should trigger and gain 1 lore
//     await testEngine.exertCard(dewey);
//     await testEngine.challenge({
//       attacker: maui,
//       defender: dewey,
//     });
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//
//     // Maui survives with 1 damage, manually ready them for a second challenge
//     expect(maui.meta.damage).toBe(4);
//     maui.updateCardMeta({ exerted: false });
//     expect(maui.ready).toBe(true);
//
//     // Second challenge - should NOT trigger again (only "next time" = once)
//     await testEngine.exertCard(bagheera);
//     await testEngine.challenge({
//       attacker: maui,
//       defender: bagheera,
//     });
//
//     // Lore should still be 1 (not 2), proving it only triggered once
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//   });
//
//   it("triggers again when the card is played a second time targeting a different character", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: nextStopOlympus.cost * 2,
//         hand: [nextStopOlympus],
//         play: [mauiHeroToAll, bagheeraCautiousExplorer],
//       },
//       { play: [deweyLovableShowoff] },
//     );
//
//     const maui = testEngine.getCardModel(mauiHeroToAll);
//     const bagheera = testEngine.getCardModel(bagheeraCautiousExplorer);
//     const dewey = testEngine.getCardModel(deweyLovableShowoff, 1);
//     const card = testEngine.getCardModel(nextStopOlympus);
//
//     // First play - targeting Maui
//     await testEngine.exertCard(maui);
//     await testEngine.playCard(nextStopOlympus);
//     await testEngine.resolveTopOfStack({ targets: [maui] });
//
//     expect(maui.ready).toBe(true);
//     expect(card.zone).toBe("discard");
//
//     // Maui challenges and gains 1 lore
//     await testEngine.exertCard(dewey);
//     await testEngine.challenge({
//       attacker: maui,
//       defender: dewey,
//     });
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//
//     // Return the card from discard to hand (like Maui - Half Shark's ability)
//     card.moveTo("hand");
//     expect(card.zone).toBe("hand");
//
//     // Second play - targeting Bagheera (different character)
//     await testEngine.exertCard(bagheera);
//     await testEngine.playCard(card);
//     await testEngine.resolveTopOfStack({ targets: [bagheera] });
//
//     expect(bagheera.ready).toBe(true);
//     expect(card.zone).toBe("discard");
//
//     // Reset dewey for another challenge
//     dewey.updateCardMeta({ damage: 0 });
//     dewey.moveTo("play");
//
//     // Bagheera challenges and should also gain 1 lore
//     await testEngine.exertCard(dewey);
//     await testEngine.challenge({
//       attacker: bagheera,
//       defender: dewey,
//     });
//
//     // Should now have 2 lore total (1 from Maui, 1 from Bagheera)
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
//
//   it("triggers again when played twice on the SAME character (Maui - Half Shark scenario)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: nextStopOlympus.cost * 2,
//         hand: [nextStopOlympus],
//         play: [mauiHeroToAll],
//       },
//       { play: [deweyLovableShowoff, bagheeraCautiousExplorer] },
//     );
//
//     const maui = testEngine.getCardModel(mauiHeroToAll);
//     const dewey = testEngine.getCardModel(deweyLovableShowoff, 1);
//     const bagheera = testEngine.getCardModel(bagheeraCautiousExplorer, 1);
//     const card = testEngine.getCardModel(nextStopOlympus);
//
//     // First play - targeting Maui
//     await testEngine.exertCard(maui);
//     await testEngine.playCard(nextStopOlympus);
//     await testEngine.resolveTopOfStack({ targets: [maui] });
//
//     expect(maui.ready).toBe(true);
//     expect(card.zone).toBe("discard");
//
//     // Maui challenges and gains 1 lore
//     await testEngine.exertCard(dewey);
//     await testEngine.challenge({
//       attacker: maui,
//       defender: dewey,
//     });
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//
//     // Return the card from discard to hand (Maui - Half Shark ability)
//     card.moveTo("hand");
//     expect(card.zone).toBe("hand");
//
//     // Second play - targeting the SAME character (Maui) again
//     await testEngine.playCard(card);
//     await testEngine.resolveTopOfStack({ targets: [maui] });
//
//     expect(maui.ready).toBe(true);
//     expect(card.zone).toBe("discard");
//
//     // Maui challenges again and should gain another 1 lore
//     await testEngine.exertCard(bagheera);
//     await testEngine.challenge({
//       attacker: maui,
//       defender: bagheera,
//     });
//
//     // Should now have 2 lore total (1 from first play, 1 from second play)
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
// });
//
