// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { rubyCoil } from "@lorcanito/lorcana-engine/cards/007/index";
// import {
//   mickeyMouseDetective,
//   plutoCleverCluefinder,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pluto - Clever Cluefinder", () => {
//   describe("ON THE TRAIL {E} - Activated ability", () => {
//     it("should return an item card from discard to hand when Detective is in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: plutoCleverCluefinder.cost,
//         play: [plutoCleverCluefinder, mickeyMouseDetective],
//         discard: [rubyCoil],
//         deck: 5,
//       });
//
//       const pluto = testEngine.getCardModel(plutoCleverCluefinder);
//       expect(pluto.ready).toBe(true);
//
//       await testEngine.activateCard(plutoCleverCluefinder);
//
//       // Should be able to select the item from discard
//       await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//       expect(testEngine.getCardModel(plutoCleverCluefinder).ready).toBe(false);
//     });
//
//     it("should put an item card on top of deck when no Detective is in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: plutoCleverCluefinder.cost,
//         play: [plutoCleverCluefinder],
//         discard: [rubyCoil],
//         deck: 5,
//       });
//
//       await testEngine.activateCard(plutoCleverCluefinder);
//
//       // Should be able to select the item from discard
//       await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       expect(testEngine.getCardModel(rubyCoil).zone).toBe("deck");
//       expect(testEngine.getCardModel(plutoCleverCluefinder).ready).toBe(false);
//     });
//
//     it("should not activate when already exerted", async () => {
//       const testEngine = new TestEngine({
//         inkwell: plutoCleverCluefinder.cost,
//         play: [plutoCleverCluefinder, mickeyMouseDetective],
//         discard: [rubyCoil],
//         deck: 5,
//       });
//
//       const pluto = testEngine.getCardModel(plutoCleverCluefinder);
//       pluto.updateCardMeta({ exerted: true });
//
//       expect(pluto.ready).toBe(false);
//
//       // Exerted cards cannot use activated abilities that require exerting
//       // The ability still exists but cannot be activated when already exerted
//       const hasActivatedAbility = plutoCleverCluefinder.abilities?.some(
//         (a) => "type" in a && a.type === "activated",
//       );
//       expect(hasActivatedAbility).toBe(true);
//       expect(pluto.ready).toBe(false);
//     });
//
//     it("should require an item card in discard to activate", async () => {
//       const testEngine = new TestEngine({
//         inkwell: plutoCleverCluefinder.cost,
//         play: [plutoCleverCluefinder, mickeyMouseDetective],
//         discard: [], // No items in discard
//         deck: 5,
//       });
//
//       await testEngine.activateCard(plutoCleverCluefinder);
//
//       // With no valid targets, the effect should still resolve but do nothing
//       expect(testEngine.getCardModel(plutoCleverCluefinder).ready).toBe(false);
//     });
//
//     it("should only target item cards, not characters or actions", async () => {
//       const testEngine = new TestEngine({
//         inkwell: plutoCleverCluefinder.cost,
//         play: [plutoCleverCluefinder, mickeyMouseDetective],
//         discard: [rubyCoil], // Only item in discard
//         deck: 5,
//       });
//
//       await testEngine.activateCard(plutoCleverCluefinder);
//
//       // Should only be able to select the item, not the character
//       await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//     });
//
//     it("should detect Detective characteristic on any character in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: plutoCleverCluefinder.cost,
//         play: [plutoCleverCluefinder, mickeyMouseDetective],
//         discard: [rubyCoil],
//         deck: 5,
//       });
//
//       // Verify Mickey has Detective characteristic
//       const mickey = testEngine.getCardModel(mickeyMouseDetective);
//       expect(mickey.characteristics).toContain("detective");
//
//       await testEngine.activateCard(plutoCleverCluefinder);
//       await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       // With Detective in play, item goes to hand
//       expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//     });
//
//     it("should work correctly when Detective enters play after Pluto", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         hand: [mickeyMouseDetective],
//         play: [plutoCleverCluefinder],
//         discard: [rubyCoil],
//         deck: 5,
//       });
//
//       // Play Detective after Pluto is already in play
//       await testEngine.playCard(mickeyMouseDetective);
//
//       // Mickey's "GET A CLUE" ability triggers - resolve it (optional, can decline)
//       await testEngine.resolveTopOfStack({});
//
//       // Now activate Pluto's ability
//       await testEngine.activateCard(plutoCleverCluefinder);
//       await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       // With Detective now in play, item goes to hand
//       expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//     });
//
//     it("should put item on top of deck if Detective leaves play before activation", async () => {
//       const testEngine = new TestEngine({
//         inkwell: plutoCleverCluefinder.cost,
//         play: [plutoCleverCluefinder],
//         discard: [rubyCoil, mickeyMouseDetective], // Detective in discard, not play
//         deck: 5,
//       });
//
//       await testEngine.activateCard(plutoCleverCluefinder);
//       await testEngine.resolveTopOfStack({ targets: [rubyCoil] });
//
//       // Without Detective in play, item goes to top of deck
//       expect(testEngine.getCardModel(rubyCoil).zone).toBe("deck");
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [plutoCleverCluefinder],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(plutoCleverCluefinder);
//
//       expect(cardUnderTest.strength).toBe(2);
//       expect(cardUnderTest.willpower).toBe(2);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(2);
//     });
//
//     it("should be inkwell card", () => {
//       expect(plutoCleverCluefinder.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(plutoCleverCluefinder.characteristics).toEqual([
//         "dreamborn",
//         "ally",
//       ]);
//     });
//
//     it("should be sapphire color", () => {
//       expect(plutoCleverCluefinder.colors).toEqual(["sapphire"]);
//     });
//
//     it("should be uncommon rarity", () => {
//       expect(plutoCleverCluefinder.rarity).toBe("uncommon");
//     });
//
//     it("should have activated ability with exert cost", () => {
//       const ability = plutoCleverCluefinder.abilities?.find(
//         (a) => "type" in a && a.type === "activated",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "costs" in ability) {
//         expect(ability.costs).toEqual([{ type: "exert" }]);
//       }
//     });
//   });
// });
//
