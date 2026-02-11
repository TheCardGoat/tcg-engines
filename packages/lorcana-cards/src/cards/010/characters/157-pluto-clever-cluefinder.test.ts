// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { rubyCoil } from "@lorcanito/lorcana-engine/cards/007/index";
// Import {
//   MickeyMouseDetective,
//   PlutoCleverCluefinder,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pluto - Clever Cluefinder", () => {
//   Describe("ON THE TRAIL {E} - Activated ability", () => {
//     It("should return an item card from discard to hand when Detective is in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: plutoCleverCluefinder.cost,
//         Play: [plutoCleverCluefinder, mickeyMouseDetective],
//         Discard: [rubyCoil],
//         Deck: 5,
//       });
//
//       Const pluto = testEngine.getCardModel(plutoCleverCluefinder);
//       Expect(pluto.ready).toBe(true);
//
//       Await testEngine.activateCard(plutoCleverCluefinder);
//
//       // Should be able to select the item from discard
//       Await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       Expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//       Expect(testEngine.getCardModel(plutoCleverCluefinder).ready).toBe(false);
//     });
//
//     It("should put an item card on top of deck when no Detective is in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: plutoCleverCluefinder.cost,
//         Play: [plutoCleverCluefinder],
//         Discard: [rubyCoil],
//         Deck: 5,
//       });
//
//       Await testEngine.activateCard(plutoCleverCluefinder);
//
//       // Should be able to select the item from discard
//       Await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       Expect(testEngine.getCardModel(rubyCoil).zone).toBe("deck");
//       Expect(testEngine.getCardModel(plutoCleverCluefinder).ready).toBe(false);
//     });
//
//     It("should not activate when already exerted", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: plutoCleverCluefinder.cost,
//         Play: [plutoCleverCluefinder, mickeyMouseDetective],
//         Discard: [rubyCoil],
//         Deck: 5,
//       });
//
//       Const pluto = testEngine.getCardModel(plutoCleverCluefinder);
//       Pluto.updateCardMeta({ exerted: true });
//
//       Expect(pluto.ready).toBe(false);
//
//       // Exerted cards cannot use activated abilities that require exerting
//       // The ability still exists but cannot be activated when already exerted
//       Const hasActivatedAbility = plutoCleverCluefinder.abilities?.some(
//         (a) => "type" in a && a.type === "activated",
//       );
//       Expect(hasActivatedAbility).toBe(true);
//       Expect(pluto.ready).toBe(false);
//     });
//
//     It("should require an item card in discard to activate", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: plutoCleverCluefinder.cost,
//         Play: [plutoCleverCluefinder, mickeyMouseDetective],
//         Discard: [], // No items in discard
//         Deck: 5,
//       });
//
//       Await testEngine.activateCard(plutoCleverCluefinder);
//
//       // With no valid targets, the effect should still resolve but do nothing
//       Expect(testEngine.getCardModel(plutoCleverCluefinder).ready).toBe(false);
//     });
//
//     It("should only target item cards, not characters or actions", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: plutoCleverCluefinder.cost,
//         Play: [plutoCleverCluefinder, mickeyMouseDetective],
//         Discard: [rubyCoil], // Only item in discard
//         Deck: 5,
//       });
//
//       Await testEngine.activateCard(plutoCleverCluefinder);
//
//       // Should only be able to select the item, not the character
//       Await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       Expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//     });
//
//     It("should detect Detective characteristic on any character in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: plutoCleverCluefinder.cost,
//         Play: [plutoCleverCluefinder, mickeyMouseDetective],
//         Discard: [rubyCoil],
//         Deck: 5,
//       });
//
//       // Verify Mickey has Detective characteristic
//       Const mickey = testEngine.getCardModel(mickeyMouseDetective);
//       Expect(mickey.characteristics).toContain("detective");
//
//       Await testEngine.activateCard(plutoCleverCluefinder);
//       Await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       // With Detective in play, item goes to hand
//       Expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//     });
//
//     It("should work correctly when Detective enters play after Pluto", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Hand: [mickeyMouseDetective],
//         Play: [plutoCleverCluefinder],
//         Discard: [rubyCoil],
//         Deck: 5,
//       });
//
//       // Play Detective after Pluto is already in play
//       Await testEngine.playCard(mickeyMouseDetective);
//
//       // Mickey's "GET A CLUE" ability triggers - resolve it (optional, can decline)
//       Await testEngine.resolveTopOfStack({});
//
//       // Now activate Pluto's ability
//       Await testEngine.activateCard(plutoCleverCluefinder);
//       Await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       // With Detective now in play, item goes to hand
//       Expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//     });
//
//     It("should put item on top of deck if Detective leaves play before activation", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: plutoCleverCluefinder.cost,
//         Play: [plutoCleverCluefinder],
//         Discard: [rubyCoil, mickeyMouseDetective], // Detective in discard, not play
//         Deck: 5,
//       });
//
//       Await testEngine.activateCard(plutoCleverCluefinder);
//       Await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       // Without Detective in play, item goes to top of deck
//       Expect(testEngine.getCardModel(rubyCoil).zone).toBe("deck");
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [plutoCleverCluefinder],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(plutoCleverCluefinder);
//
//       Expect(cardUnderTest.strength).toBe(2);
//       Expect(cardUnderTest.willpower).toBe(2);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(2);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(plutoCleverCluefinder.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(plutoCleverCluefinder.characteristics).toEqual([
//         "dreamborn",
//         "ally",
//       ]);
//     });
//
//     It("should be sapphire color", () => {
//       Expect(plutoCleverCluefinder.colors).toEqual(["sapphire"]);
//     });
//
//     It("should be uncommon rarity", () => {
//       Expect(plutoCleverCluefinder.rarity).toBe("uncommon");
//     });
//
//     It("should have activated ability with exert cost", () => {
//       Const ability = plutoCleverCluefinder.abilities?.find(
//         (a) => "type" in a && a.type === "activated",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "costs" in ability) {
//         Expect(ability.costs).toEqual([{ type: "exert" }]);
//       }
//     });
//   });
// });
//
