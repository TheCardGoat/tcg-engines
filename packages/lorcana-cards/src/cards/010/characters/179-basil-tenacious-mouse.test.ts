// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   basilTenaciousMouse,
//   gurgiAppleLover,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Basil - Tenacious Mouse", () => {
//   describe("HOLD YOUR GROUND", () => {
//     it("should have the ability defined with correct structure", () => {
//       const ability = basilTenaciousMouse.abilities?.find(
//         (a) => "name" in a && a.name === "HOLD YOUR GROUND",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const resistEffect = ability.effects[0] as any;
//         expect(resistEffect.type).toBe("ability");
//         expect(resistEffect.ability).toBe("resist");
//         expect(resistEffect.amount).toBe(1);
//         expect(resistEffect.duration).toBe("next_turn");
//       }
//     });
//
//     it("should trigger when you play another Detective character", () => {
//       const ability = basilTenaciousMouse.abilities?.find(
//         (a) => "name" in a && a.name === "HOLD YOUR GROUND",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (
//         ability &&
//         "trigger" in ability &&
//         ability.trigger &&
//         typeof ability.trigger === "object" &&
//         "on" in ability.trigger
//       ) {
//         expect(ability.trigger.on).toBe("play");
//       }
//     });
//
//     it("should apply effect to this character", () => {
//       const ability = basilTenaciousMouse.abilities?.find(
//         (a) => "name" in a && a.name === "HOLD YOUR GROUND",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const resistEffect = ability.effects[0] as any;
//         expect(resistEffect.target).toBeDefined();
//       }
//     });
//
//     it("should grant Resist +1 to Basil when another Detective is played", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: mickeyMouseDetective.cost,
//           hand: [mickeyMouseDetective],
//           play: [basilTenaciousMouse],
//         },
//         {},
//       );
//
//       const basilModel = testEngine.getCardModel(basilTenaciousMouse);
//
//       // Basil should not have resist initially
//       expect(basilModel.hasResist).toBe(false);
//
//       await testEngine.playCard(mickeyMouseDetective);
//
//       // Resolve Mickey's optional "GET A CLUE" ability by declining it
//       await testEngine.resolveOptionalAbility();
//
//       // Basil's "HOLD YOUR GROUND" ability should auto-resolve after the optional ability
//       // After playing another Detective, Basil should have Resist +1
//       expect(basilModel.hasResist).toBe(true);
//     });
//
//     it.skip("should NOT trigger when Basil himself is played (excludeSelf)", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: basilTenaciousMouse.cost,
//           hand: [basilTenaciousMouse],
//         },
//         {},
//       );
//
//       await testEngine.playCard(basilTenaciousMouse);
//
//       const basilModel = testEngine.getCardModel(basilTenaciousMouse);
//
//       // Card text says "whenever you play another Detective character"
//       // The word "another" means it should NOT trigger on itself
//       // FIXME: This test is currently failing due to an issue with excludeSelf in triggerTarget
//       // The implementation needs to be fixed to properly exclude self from triggering
//       expect(basilModel.hasResist).toBe(false);
//     });
//
//     it("should NOT trigger when playing a non-Detective character", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: gurgiAppleLover.cost,
//           hand: [gurgiAppleLover],
//           play: [basilTenaciousMouse],
//         },
//         {},
//       );
//
//       const basilModel = testEngine.getCardModel(basilTenaciousMouse);
//
//       // Initially Basil should not have resist
//       expect(basilModel.hasResist).toBe(false);
//
//       await testEngine.playCard(gurgiAppleLover);
//
//       // Skip Gurgi's optional "HAPPY DAY" ability
//       await testEngine.skipTopOfStack();
//
//       // Gurgi is not a detective, so Basil's ability should not have triggered
//       expect(basilModel.hasResist).toBe(false);
//     });
//
//     it("resist should last until the start of your next turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: mickeyMouseDetective.cost,
//           hand: [mickeyMouseDetective],
//           play: [basilTenaciousMouse],
//         },
//         {},
//       );
//
//       const basilModel = testEngine.getCardModel(basilTenaciousMouse);
//
//       await testEngine.playCard(mickeyMouseDetective);
//
//       // Resolve Mickey's optional "GET A CLUE" ability by declining it
//       await testEngine.resolveOptionalAbility();
//
//       expect(basilModel.hasResist).toBe(true);
//
//       // Pass turn to opponent
//       await testEngine.passTurn();
//
//       // During opponent's turn, Basil should still have resist
//       expect(basilModel.hasResist).toBe(true);
//
//       // Pass back to your turn
//       await testEngine.passTurn();
//
//       // At the start of your next turn, resist should be removed
//       expect(basilModel.hasResist).toBe(false);
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [basilTenaciousMouse],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(basilTenaciousMouse);
//
//       expect(cardUnderTest.strength).toBe(3);
//       expect(cardUnderTest.willpower).toBe(2);
//       expect(cardUnderTest.lore).toBe(2);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should be inkwell card", () => {
//       expect(basilTenaciousMouse.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics for Detective synergy", () => {
//       expect(basilTenaciousMouse.characteristics).toEqual([
//         "dreamborn",
//         "hero",
//         "detective",
//       ]);
//     });
//
//     it("should be steel color", () => {
//       expect(basilTenaciousMouse.colors).toEqual(["steel"]);
//     });
//
//     it("should be common rarity", () => {
//       expect(basilTenaciousMouse.rarity).toBe("common");
//     });
//   });
// });
//
