// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   basilTenaciousMouse,
//   hudsonDeterminedReader,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hudson - Determined Reader", () => {
//   describe("FINDING ANSWERS - Behavioral Tests", () => {
//     it("should allow drawing a card then discarding a card when played", async () => {
//       const testEngine = new TestEngine({
//         inkwell: hudsonDeterminedReader.cost,
//         hand: [hudsonDeterminedReader],
//         deck: [basilTenaciousMouse, basilTenaciousMouse],
//       });
//
//       await testEngine.playCard(hudsonDeterminedReader);
//
//       // Accept the optional ability
//       await testEngine.acceptOptionalLayer();
//
//       // After drawing, should have drawn 1 card
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//       // Choose a card to discard
//       const cardToDiscard = testEngine.getByZoneAndId(
//         "hand",
//         basilTenaciousMouse.id,
//       );
//       await testEngine.resolveTopOfStack({ targets: [cardToDiscard] });
//
//       // Final hand should be empty (played 1, drew 1, discarded 1)
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//
//       // Discard should have 1 card
//       expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
//     });
//
//     it("should allow declining the optional ability", async () => {
//       const testEngine = new TestEngine({
//         inkwell: hudsonDeterminedReader.cost,
//         hand: [hudsonDeterminedReader],
//         deck: [basilTenaciousMouse],
//       });
//
//       await testEngine.playCard(hudsonDeterminedReader);
//
//       // Skip the optional ability
//       await testEngine.skipTopOfStack();
//
//       // Hand should be empty (just played Hudson)
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//
//       // Deck should be unchanged (1 card)
//       expect(testEngine.getZonesCardCount("player_one").deck).toBe(1);
//     });
//
//     it("should trigger when you play this character", () => {
//       const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "FINDING ANSWERS",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (
//         ability &&
//         "trigger" in ability &&
//         ability.trigger &&
//         typeof ability.trigger === "object"
//       ) {
//         expect((ability.trigger as any).on).toBe("play");
//       }
//     });
//
//     it("should be optional", () => {
//       const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "FINDING ANSWERS",
//       );
//
//       expect(ability).toBeDefined();
//       if (ability && "optional" in ability) {
//         expect(ability.optional).toBe(true);
//       }
//     });
//   });
//
//   describe("STONE BY DAY - Structure Tests", () => {
//     it("should have ready restriction effect", () => {
//       const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       expect(ability).toBeDefined();
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const restrictionEffect = ability.effects[0] as any;
//         expect(restrictionEffect.type).toBe("restriction");
//         expect(restrictionEffect.restriction).toBe("ready");
//         expect(restrictionEffect.duration).toBe("static");
//       }
//     });
//
//     it("should have condition for 3 or more cards in hand", () => {
//       const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       expect(ability).toBeDefined();
//       if (
//         ability &&
//         "conditions" in ability &&
//         Array.isArray(ability.conditions)
//       ) {
//         const condition = ability.conditions[0] as any;
//         expect(condition.type).toBe("filter");
//         expect(condition.comparison?.operator).toBe("gte");
//         expect(condition.comparison?.value).toBe(3);
//       }
//     });
//
//     it("should have Stone By Day ability defined", () => {
//       const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       expect(ability).toBeDefined();
//       if (
//         ability &&
//         "type" in ability &&
//         ability.type === "static" &&
//         "ability" in ability
//       ) {
//         expect((ability as any).ability).toBe("effects");
//       }
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [hudsonDeterminedReader],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(hudsonDeterminedReader);
//
//       expect(cardUnderTest.strength).toBe(2);
//       expect(cardUnderTest.willpower).toBe(4);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(2);
//     });
//
//     it("should be inkwell card", () => {
//       expect(hudsonDeterminedReader.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(hudsonDeterminedReader.characteristics).toEqual([
//         "storyborn",
//         "mentor",
//         "gargoyle",
//       ]);
//     });
//
//     it("should be steel color", () => {
//       expect(hudsonDeterminedReader.colors).toEqual(["steel"]);
//     });
//
//     it("should be common rarity", () => {
//       expect(hudsonDeterminedReader.rarity).toBe("common");
//     });
//   });
// });
//
