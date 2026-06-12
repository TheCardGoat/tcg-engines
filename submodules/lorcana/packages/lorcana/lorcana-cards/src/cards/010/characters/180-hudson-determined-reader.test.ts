// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilTenaciousMouse,
//   HudsonDeterminedReader,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hudson - Determined Reader", () => {
//   Describe("FINDING ANSWERS - Behavioral Tests", () => {
//     It("should allow drawing a card then discarding a card when played", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: hudsonDeterminedReader.cost,
//         Hand: [hudsonDeterminedReader],
//         Deck: [basilTenaciousMouse, basilTenaciousMouse],
//       });
//
//       Await testEngine.playCard(hudsonDeterminedReader);
//
//       // Accept the optional ability
//       Await testEngine.acceptOptionalLayer();
//
//       // After drawing, should have drawn 1 card
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//       // Choose a card to discard
//       Const cardToDiscard = testEngine.getByZoneAndId(
//         "hand",
//         BasilTenaciousMouse.id,
//       );
//       Await testEngine.resolveTopOfStack({ targets: [cardToDiscard] });
//
//       // Final hand should be empty (played 1, drew 1, discarded 1)
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//
//       // Discard should have 1 card
//       Expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
//     });
//
//     It("should allow declining the optional ability", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: hudsonDeterminedReader.cost,
//         Hand: [hudsonDeterminedReader],
//         Deck: [basilTenaciousMouse],
//       });
//
//       Await testEngine.playCard(hudsonDeterminedReader);
//
//       // Skip the optional ability
//       Await testEngine.skipTopOfStack();
//
//       // Hand should be empty (just played Hudson)
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//
//       // Deck should be unchanged (1 card)
//       Expect(testEngine.getZonesCardCount("player_one").deck).toBe(1);
//     });
//
//     It("should trigger when you play this character", () => {
//       Const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "FINDING ANSWERS",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (
//         Ability &&
//         "trigger" in ability &&
//         Ability.trigger &&
//         Typeof ability.trigger === "object"
//       ) {
//         Expect((ability.trigger as any).on).toBe("play");
//       }
//     });
//
//     It("should be optional", () => {
//       Const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "FINDING ANSWERS",
//       );
//
//       Expect(ability).toBeDefined();
//       If (ability && "optional" in ability) {
//         Expect(ability.optional).toBe(true);
//       }
//     });
//   });
//
//   Describe("STONE BY DAY - Structure Tests", () => {
//     It("should have ready restriction effect", () => {
//       Const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       Expect(ability).toBeDefined();
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const restrictionEffect = ability.effects[0] as any;
//         Expect(restrictionEffect.type).toBe("restriction");
//         Expect(restrictionEffect.restriction).toBe("ready");
//         Expect(restrictionEffect.duration).toBe("static");
//       }
//     });
//
//     It("should have condition for 3 or more cards in hand", () => {
//       Const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       Expect(ability).toBeDefined();
//       If (
//         Ability &&
//         "conditions" in ability &&
//         Array.isArray(ability.conditions)
//       ) {
//         Const condition = ability.conditions[0] as any;
//         Expect(condition.type).toBe("filter");
//         Expect(condition.comparison?.operator).toBe("gte");
//         Expect(condition.comparison?.value).toBe(3);
//       }
//     });
//
//     It("should have Stone By Day ability defined", () => {
//       Const ability = hudsonDeterminedReader.abilities?.find(
//         (a) => "name" in a && a.name === "STONE BY DAY",
//       );
//
//       Expect(ability).toBeDefined();
//       If (
//         Ability &&
//         "type" in ability &&
//         Ability.type === "static" &&
//         "ability" in ability
//       ) {
//         Expect((ability as any).ability).toBe("effects");
//       }
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [hudsonDeterminedReader],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(hudsonDeterminedReader);
//
//       Expect(cardUnderTest.strength).toBe(2);
//       Expect(cardUnderTest.willpower).toBe(4);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(2);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(hudsonDeterminedReader.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(hudsonDeterminedReader.characteristics).toEqual([
//         "storyborn",
//         "mentor",
//         "gargoyle",
//       ]);
//     });
//
//     It("should be steel color", () => {
//       Expect(hudsonDeterminedReader.colors).toEqual(["steel"]);
//     });
//
//     It("should be common rarity", () => {
//       Expect(hudsonDeterminedReader.rarity).toBe("common");
//     });
//   });
// });
//
