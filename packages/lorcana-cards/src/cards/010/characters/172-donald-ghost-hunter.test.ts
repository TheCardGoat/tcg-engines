// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   donaldGhostHunter,
//   goofyGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Donald - Ghost Hunter", () => {
//   describe("RAISE A RUCKUS - Behavioral Tests", () => {
//     it("should grant Challenger +2 to chosen Detective character when played", async () => {
//       const testEngine = new TestEngine({
//         inkwell: donaldGhostHunter.cost,
//         hand: [donaldGhostHunter],
//         play: [goofyGhostHunter],
//       });
//
//       const targetDetective = testEngine.getCardModel(goofyGhostHunter);
//       expect(targetDetective.hasChallenger).toBe(false);
//
//       await testEngine.playCard(donaldGhostHunter);
//       await testEngine.resolveTopOfStack({ targets: [targetDetective] });
//
//       expect(targetDetective.hasChallenger).toBe(true);
//     });
//
//     it("should allow Donald to target himself (he is a Detective)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: donaldGhostHunter.cost,
//         hand: [donaldGhostHunter],
//       });
//
//       await testEngine.playCard(donaldGhostHunter);
//       const donaldModel = testEngine.getCardModel(donaldGhostHunter);
//
//       await testEngine.resolveTopOfStack({ targets: [donaldModel] });
//
//       expect(donaldModel.hasChallenger).toBe(true);
//     });
//
//     it("should only target Detective characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: donaldGhostHunter.cost,
//         hand: [donaldGhostHunter],
//         play: [goofyGhostHunter],
//       });
//
//       const detective = testEngine.getCardModel(goofyGhostHunter);
//
//       await testEngine.playCard(donaldGhostHunter);
//
//       // The ability should have targeting restrictions to Detective only
//       const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
//       );
//
//       expect(ability).toBeDefined();
//       if (ability && "target" in ability) {
//         const target = ability.target as any;
//         const detectiveFilter = target.filters?.find(
//           (f: any) =>
//             f.filter === "characteristics" && f.value.includes("detective"),
//         );
//         expect(detectiveFilter).toBeDefined();
//       }
//     });
//
//     it("should grant Challenger +2 for the rest of the turn only", async () => {
//       const testEngine = new TestEngine({
//         inkwell: donaldGhostHunter.cost,
//         hand: [donaldGhostHunter],
//         play: [goofyGhostHunter],
//       });
//
//       const targetDetective = testEngine.getCardModel(goofyGhostHunter);
//
//       await testEngine.playCard(donaldGhostHunter);
//       await testEngine.resolveTopOfStack({ targets: [targetDetective] });
//
//       expect(targetDetective.hasChallenger).toBe(true);
//
//       // Pass to next turn
//       testEngine.passTurn();
//
//       // Challenger +2 should be removed after turn ends
//       // (Duration is 'turn' which expires at end of turn)
//       expect(targetDetective.hasChallenger).toBe(false);
//     });
//
//     it("should apply +2 strength when the Detective challenges", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: donaldGhostHunter.cost,
//           hand: [donaldGhostHunter],
//           play: [goofyGhostHunter],
//         },
//         {
//           play: [goofyGhostHunter],
//         },
//       );
//
//       const playerDetective = testEngine.getByZoneAndId(
//         "play",
//         goofyGhostHunter.id,
//         "player_one",
//       );
//       const opponentTarget = testEngine.getByZoneAndId(
//         "play",
//         goofyGhostHunter.id,
//         "player_two",
//       );
//
//       const baseStrength = playerDetective.strength;
//
//       await testEngine.playCard(donaldGhostHunter);
//       await testEngine.resolveTopOfStack({ targets: [playerDetective] });
//
//       // When challenging, should get +2 strength from Challenger +2
//       playerDetective.exert();
//       await testEngine.challenge({
//         attacker: playerDetective,
//         defender: opponentTarget,
//       });
//
//       // Verify the challenger bonus is applied during challenge
//       expect(playerDetective.hasChallenger).toBe(true);
//     });
//   });
//
//   describe("RAISE A RUCKUS - Structure Tests", () => {
//     it("should have the ability defined with correct structure", () => {
//       const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const abilityEffect = ability.effects[0] as any;
//         expect(abilityEffect.type).toBe("ability");
//         expect(abilityEffect.ability).toBe("challenger");
//         expect(abilityEffect.duration).toBe("turn");
//       }
//     });
//
//     it("should grant Challenger +2", () => {
//       const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const abilityEffect = ability.effects[0] as any;
//         expect(abilityEffect.ability).toBe("challenger");
//         expect(abilityEffect.amount).toBe(2);
//       }
//     });
//
//     it("should target Detective characters", () => {
//       const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const abilityEffect = ability.effects[0] as any;
//         const target = abilityEffect.target;
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
//     it("should trigger when you play this character", () => {
//       const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
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
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [donaldGhostHunter],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(donaldGhostHunter);
//
//       expect(cardUnderTest.strength).toBe(5);
//       expect(cardUnderTest.willpower).toBe(4);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(4);
//     });
//
//     it("should be inkwell card", () => {
//       expect(donaldGhostHunter.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics for Detective synergy", () => {
//       expect(donaldGhostHunter.characteristics).toEqual([
//         "dreamborn",
//         "hero",
//         "detective",
//       ]);
//     });
//
//     it("should be steel color", () => {
//       expect(donaldGhostHunter.colors).toEqual(["steel"]);
//     });
//
//     it("should be common rarity", () => {
//       expect(donaldGhostHunter.rarity).toBe("common");
//     });
//   });
// });
//
