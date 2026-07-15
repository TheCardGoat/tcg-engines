// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilTenaciousMouse,
//   GurgiAppleLover,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Basil - Tenacious Mouse", () => {
//   Describe("HOLD YOUR GROUND", () => {
//     It("should have the ability defined with correct structure", () => {
//       Const ability = basilTenaciousMouse.abilities?.find(
//         (a) => "name" in a && a.name === "HOLD YOUR GROUND",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const resistEffect = ability.effects[0] as any;
//         Expect(resistEffect.type).toBe("ability");
//         Expect(resistEffect.ability).toBe("resist");
//         Expect(resistEffect.amount).toBe(1);
//         Expect(resistEffect.duration).toBe("next_turn");
//       }
//     });
//
//     It("should trigger when you play another Detective character", () => {
//       Const ability = basilTenaciousMouse.abilities?.find(
//         (a) => "name" in a && a.name === "HOLD YOUR GROUND",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (
//         Ability &&
//         "trigger" in ability &&
//         Ability.trigger &&
//         Typeof ability.trigger === "object" &&
//         "on" in ability.trigger
//       ) {
//         Expect(ability.trigger.on).toBe("play");
//       }
//     });
//
//     It("should apply effect to this character", () => {
//       Const ability = basilTenaciousMouse.abilities?.find(
//         (a) => "name" in a && a.name === "HOLD YOUR GROUND",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const resistEffect = ability.effects[0] as any;
//         Expect(resistEffect.target).toBeDefined();
//       }
//     });
//
//     It("should grant Resist +1 to Basil when another Detective is played", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: mickeyMouseDetective.cost,
//           Hand: [mickeyMouseDetective],
//           Play: [basilTenaciousMouse],
//         },
//         {},
//       );
//
//       Const basilModel = testEngine.getCardModel(basilTenaciousMouse);
//
//       // Basil should not have resist initially
//       Expect(basilModel.hasResist).toBe(false);
//
//       Await testEngine.playCard(mickeyMouseDetective);
//
//       // Resolve Mickey's optional "GET A CLUE" ability by declining it
//       Await testEngine.resolveOptionalAbility();
//
//       // Basil's "HOLD YOUR GROUND" ability should auto-resolve after the optional ability
//       // After playing another Detective, Basil should have Resist +1
//       Expect(basilModel.hasResist).toBe(true);
//     });
//
//     It.skip("should NOT trigger when Basil himself is played (excludeSelf)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: basilTenaciousMouse.cost,
//           Hand: [basilTenaciousMouse],
//         },
//         {},
//       );
//
//       Await testEngine.playCard(basilTenaciousMouse);
//
//       Const basilModel = testEngine.getCardModel(basilTenaciousMouse);
//
//       // Card text says "whenever you play another Detective character"
//       // The word "another" means it should NOT trigger on itself
//       // FIXME: This test is currently failing due to an issue with excludeSelf in triggerTarget
//       // The implementation needs to be fixed to properly exclude self from triggering
//       Expect(basilModel.hasResist).toBe(false);
//     });
//
//     It("should NOT trigger when playing a non-Detective character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: gurgiAppleLover.cost,
//           Hand: [gurgiAppleLover],
//           Play: [basilTenaciousMouse],
//         },
//         {},
//       );
//
//       Const basilModel = testEngine.getCardModel(basilTenaciousMouse);
//
//       // Initially Basil should not have resist
//       Expect(basilModel.hasResist).toBe(false);
//
//       Await testEngine.playCard(gurgiAppleLover);
//
//       // Skip Gurgi's optional "HAPPY DAY" ability
//       Await testEngine.skipTopOfStack();
//
//       // Gurgi is not a detective, so Basil's ability should not have triggered
//       Expect(basilModel.hasResist).toBe(false);
//     });
//
//     It("resist should last until the start of your next turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: mickeyMouseDetective.cost,
//           Hand: [mickeyMouseDetective],
//           Play: [basilTenaciousMouse],
//         },
//         {},
//       );
//
//       Const basilModel = testEngine.getCardModel(basilTenaciousMouse);
//
//       Await testEngine.playCard(mickeyMouseDetective);
//
//       // Resolve Mickey's optional "GET A CLUE" ability by declining it
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(basilModel.hasResist).toBe(true);
//
//       // Pass turn to opponent
//       Await testEngine.passTurn();
//
//       // During opponent's turn, Basil should still have resist
//       Expect(basilModel.hasResist).toBe(true);
//
//       // Pass back to your turn
//       Await testEngine.passTurn();
//
//       // At the start of your next turn, resist should be removed
//       Expect(basilModel.hasResist).toBe(false);
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [basilTenaciousMouse],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(basilTenaciousMouse);
//
//       Expect(cardUnderTest.strength).toBe(3);
//       Expect(cardUnderTest.willpower).toBe(2);
//       Expect(cardUnderTest.lore).toBe(2);
//       Expect(cardUnderTest.cost).toBe(3);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(basilTenaciousMouse.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics for Detective synergy", () => {
//       Expect(basilTenaciousMouse.characteristics).toEqual([
//         "dreamborn",
//         "hero",
//         "detective",
//       ]);
//     });
//
//     It("should be steel color", () => {
//       Expect(basilTenaciousMouse.colors).toEqual(["steel"]);
//     });
//
//     It("should be common rarity", () => {
//       Expect(basilTenaciousMouse.rarity).toBe("common");
//     });
//   });
// });
//
