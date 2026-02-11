// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mauiHeroToAll } from "@lorcanito/lorcana-engine/cards/001/characters/114-maui-hero-to-all";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { nextStopOlympus } from "@lorcanito/lorcana-engine/cards/010";
// Import { bagheeraCautiousExplorer } from "@lorcanito/lorcana-engine/cards/010/characters/012-bagheera-cautious-explorer";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Next Stop, Olympus", () => {
//   It("cost reduction not active if no character with 5+ strength in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: nextStopOlympus.cost,
//       Hand: [nextStopOlympus],
//       Play: [deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(nextStopOlympus);
//     Expect(cardUnderTest.cost).toBe(nextStopOlympus.cost);
//
//     Await testEngine.playCard(nextStopOlympus);
//
//     Expect(cardUnderTest.zone).toBe("discard");
//     Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(0);
//   });
//
//   It("cost reduction is active if a character with 5+ strength in play", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [nextStopOlympus],
//       Play: [mauiHeroToAll],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(nextStopOlympus);
//     Expect(cardUnderTest.cost).toBe(0);
//
//     Await testEngine.playCard(nextStopOlympus);
//
//     Expect(cardUnderTest.zone).toBe("discard");
//   });
//
//   It("Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nextStopOlympus.cost,
//         Hand: [nextStopOlympus],
//         Play: [bagheeraCautiousExplorer],
//       },
//       { play: [deweyLovableShowoff] },
//     );
//
//     Const bagheera = testEngine.getCardModel(bagheeraCautiousExplorer);
//     Await testEngine.exertCard(bagheera);
//     Expect(bagheera.ready).toBe(false);
//
//     // Play Next Stop, Olympus targeting Bagheera
//     Await testEngine.playCard(nextStopOlympus);
//     Await testEngine.resolveTopOfStack({ targets: [bagheera] });
//
//     // Verify Bagheera is ready
//     Expect(bagheera.ready).toBe(true);
//     Expect(bagheera.hasQuestRestriction).toBe(true);
//
//     Await testEngine.exertCard(deweyLovableShowoff);
//     Await testEngine.challenge({
//       Attacker: bagheera,
//       Defender: deweyLovableShowoff,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//   });
//
//   It("only triggers once on the first challenge (not multiple challenges)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nextStopOlympus.cost,
//         Hand: [nextStopOlympus],
//         Play: [mauiHeroToAll],
//       },
//       { play: [deweyLovableShowoff, bagheeraCautiousExplorer] },
//     );
//
//     Const maui = testEngine.getCardModel(mauiHeroToAll);
//     Const dewey = testEngine.getCardModel(deweyLovableShowoff, 1);
//     Const bagheera = testEngine.getCardModel(bagheeraCautiousExplorer, 1);
//
//     Await testEngine.exertCard(maui);
//     Expect(maui.ready).toBe(false);
//
//     // Play Next Stop, Olympus targeting Maui
//     Await testEngine.playCard(nextStopOlympus);
//     Await testEngine.resolveTopOfStack({ targets: [maui] });
//
//     // Verify Maui is ready and has restrictions
//     Expect(maui.ready).toBe(true);
//     Expect(maui.hasQuestRestriction).toBe(true);
//
//     // First challenge - should trigger and gain 1 lore
//     Await testEngine.exertCard(dewey);
//     Await testEngine.challenge({
//       Attacker: maui,
//       Defender: dewey,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//
//     // Maui survives with 1 damage, manually ready them for a second challenge
//     Expect(maui.meta.damage).toBe(4);
//     Maui.updateCardMeta({ exerted: false });
//     Expect(maui.ready).toBe(true);
//
//     // Second challenge - should NOT trigger again (only "next time" = once)
//     Await testEngine.exertCard(bagheera);
//     Await testEngine.challenge({
//       Attacker: maui,
//       Defender: bagheera,
//     });
//
//     // Lore should still be 1 (not 2), proving it only triggered once
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//   });
//
//   It("triggers again when the card is played a second time targeting a different character", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nextStopOlympus.cost * 2,
//         Hand: [nextStopOlympus],
//         Play: [mauiHeroToAll, bagheeraCautiousExplorer],
//       },
//       { play: [deweyLovableShowoff] },
//     );
//
//     Const maui = testEngine.getCardModel(mauiHeroToAll);
//     Const bagheera = testEngine.getCardModel(bagheeraCautiousExplorer);
//     Const dewey = testEngine.getCardModel(deweyLovableShowoff, 1);
//     Const card = testEngine.getCardModel(nextStopOlympus);
//
//     // First play - targeting Maui
//     Await testEngine.exertCard(maui);
//     Await testEngine.playCard(nextStopOlympus);
//     Await testEngine.resolveTopOfStack({ targets: [maui] });
//
//     Expect(maui.ready).toBe(true);
//     Expect(card.zone).toBe("discard");
//
//     // Maui challenges and gains 1 lore
//     Await testEngine.exertCard(dewey);
//     Await testEngine.challenge({
//       Attacker: maui,
//       Defender: dewey,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//
//     // Return the card from discard to hand (like Maui - Half Shark's ability)
//     Card.moveTo("hand");
//     Expect(card.zone).toBe("hand");
//
//     // Second play - targeting Bagheera (different character)
//     Await testEngine.exertCard(bagheera);
//     Await testEngine.playCard(card);
//     Await testEngine.resolveTopOfStack({ targets: [bagheera] });
//
//     Expect(bagheera.ready).toBe(true);
//     Expect(card.zone).toBe("discard");
//
//     // Reset dewey for another challenge
//     Dewey.updateCardMeta({ damage: 0 });
//     Dewey.moveTo("play");
//
//     // Bagheera challenges and should also gain 1 lore
//     Await testEngine.exertCard(dewey);
//     Await testEngine.challenge({
//       Attacker: bagheera,
//       Defender: dewey,
//     });
//
//     // Should now have 2 lore total (1 from Maui, 1 from Bagheera)
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
//
//   It("triggers again when played twice on the SAME character (Maui - Half Shark scenario)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nextStopOlympus.cost * 2,
//         Hand: [nextStopOlympus],
//         Play: [mauiHeroToAll],
//       },
//       { play: [deweyLovableShowoff, bagheeraCautiousExplorer] },
//     );
//
//     Const maui = testEngine.getCardModel(mauiHeroToAll);
//     Const dewey = testEngine.getCardModel(deweyLovableShowoff, 1);
//     Const bagheera = testEngine.getCardModel(bagheeraCautiousExplorer, 1);
//     Const card = testEngine.getCardModel(nextStopOlympus);
//
//     // First play - targeting Maui
//     Await testEngine.exertCard(maui);
//     Await testEngine.playCard(nextStopOlympus);
//     Await testEngine.resolveTopOfStack({ targets: [maui] });
//
//     Expect(maui.ready).toBe(true);
//     Expect(card.zone).toBe("discard");
//
//     // Maui challenges and gains 1 lore
//     Await testEngine.exertCard(dewey);
//     Await testEngine.challenge({
//       Attacker: maui,
//       Defender: dewey,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//
//     // Return the card from discard to hand (Maui - Half Shark ability)
//     Card.moveTo("hand");
//     Expect(card.zone).toBe("hand");
//
//     // Second play - targeting the SAME character (Maui) again
//     Await testEngine.playCard(card);
//     Await testEngine.resolveTopOfStack({ targets: [maui] });
//
//     Expect(maui.ready).toBe(true);
//     Expect(card.zone).toBe("discard");
//
//     // Maui challenges again and should gain another 1 lore
//     Await testEngine.exertCard(bagheera);
//     Await testEngine.challenge({
//       Attacker: maui,
//       Defender: bagheera,
//     });
//
//     // Should now have 2 lore total (1 from first play, 1 from second play)
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
// });
//
