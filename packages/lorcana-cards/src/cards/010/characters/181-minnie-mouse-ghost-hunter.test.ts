// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   donaldGhostHunter,
//   minnieMouseGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Minnie Mouse - Ghost Hunter", () => {
//   describe("SEARCH THE SHADOWS - Behavioral Tests", () => {
//     it("should grant Alert to chosen Detective character when played", async () => {
//       const testEngine = new TestEngine({
//         inkwell: minnieMouseGhostHunter.cost,
//         hand: [minnieMouseGhostHunter],
//         play: [donaldGhostHunter],
//       });
//
//       const targetDetective = testEngine.getCardModel(donaldGhostHunter);
//       expect(targetDetective.hasAlert).toBe(false);
//
//       await testEngine.playCard(minnieMouseGhostHunter);
//       await testEngine.resolveTopOfStack({ targets: [targetDetective] });
//
//       // Donald should now have Alert
//       expect(targetDetective.hasAlert).toBe(true);
//     });
//
//     it("should allow Minnie to target herself (she is a Detective)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: minnieMouseGhostHunter.cost,
//         hand: [minnieMouseGhostHunter],
//       });
//
//       await testEngine.playCard(minnieMouseGhostHunter);
//       const minnieModel = testEngine.getCardModel(minnieMouseGhostHunter);
//
//       await testEngine.resolveTopOfStack({ targets: [minnieModel] });
//
//       // Minnie should have Alert
//       expect(minnieModel.hasAlert).toBe(true);
//     });
//
//     it("should only target Detective characters", () => {
//       const ability = minnieMouseGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "SEARCH THE SHADOWS",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const alertEffect = ability.effects[0] as any;
//         const target = alertEffect.target;
//         expect(target).toBeDefined();
//         expect(target.filters).toBeDefined();
//
//         const hasDetectiveFilter = target.filters.some(
//           (f: any) =>
//             f.filter === "characteristics" && f.value.includes("detective"),
//         );
//         expect(hasDetectiveFilter).toBe(true);
//       }
//     });
//
//     it("should grant Alert for the rest of the turn only", async () => {
//       const testEngine = new TestEngine({
//         inkwell: minnieMouseGhostHunter.cost,
//         hand: [minnieMouseGhostHunter],
//         play: [donaldGhostHunter],
//       });
//
//       const targetDetective = testEngine.getCardModel(donaldGhostHunter);
//
//       await testEngine.playCard(minnieMouseGhostHunter);
//       await testEngine.resolveTopOfStack({ targets: [targetDetective] });
//
//       expect(targetDetective.hasAlert).toBe(true);
//
//       // Pass to next turn
//       testEngine.passTurn();
//
//       // Alert should be removed after turn ends (duration: "turn", until: true)
//       expect(targetDetective.hasAlert).toBe(false);
//     });
//
//     it("should trigger when you play this character", () => {
//       const ability = minnieMouseGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "SEARCH THE SHADOWS",
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
//   });
//
//   describe("SEARCH THE SHADOWS - Structure Tests", () => {
//     it("should have the ability defined with correct structure", () => {
//       const ability = minnieMouseGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "SEARCH THE SHADOWS",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const alertEffect = ability.effects[0] as any;
//         expect(alertEffect.type).toBe("ability");
//         expect(alertEffect.ability).toBe("alert");
//         expect(alertEffect.duration).toBe("turn");
//         expect(alertEffect.until).toBe(true);
//       }
//     });
//
//     it("should target Detective characters in play", () => {
//       const ability = minnieMouseGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "SEARCH THE SHADOWS",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const alertEffect = ability.effects[0] as any;
//         const target = alertEffect.target;
//         expect(target).toBeDefined();
//         expect(target.type).toBe("card");
//         expect(target.value).toBe(1);
//
//         const hasZoneFilter = target.filters.some(
//           (f: any) => f.filter === "zone" && f.value === "play",
//         );
//         const hasTypeFilter = target.filters.some(
//           (f: any) => f.filter === "type" && f.value === "character",
//         );
//         const hasOwnerFilter = target.filters.some(
//           (f: any) => f.filter === "owner" && f.value === "self",
//         );
//
//         expect(hasZoneFilter).toBe(true);
//         expect(hasTypeFilter).toBe(true);
//         expect(hasOwnerFilter).toBe(true);
//       }
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [minnieMouseGhostHunter],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(minnieMouseGhostHunter);
//
//       expect(cardUnderTest.strength).toBe(2);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(2);
//     });
//
//     it("should be inkwell card", () => {
//       expect(minnieMouseGhostHunter.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics for Detective synergy", () => {
//       expect(minnieMouseGhostHunter.characteristics).toEqual([
//         "dreamborn",
//         "hero",
//         "detective",
//       ]);
//     });
//
//     it("should be steel color", () => {
//       expect(minnieMouseGhostHunter.colors).toEqual(["steel"]);
//     });
//
//     it("should be common rarity", () => {
//       expect(minnieMouseGhostHunter.rarity).toBe("common");
//     });
//   });
// });
//
