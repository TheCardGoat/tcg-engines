// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldGhostHunter,
//   GoofyGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Donald - Ghost Hunter", () => {
//   Describe("RAISE A RUCKUS - Behavioral Tests", () => {
//     It("should grant Challenger +2 to chosen Detective character when played", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: donaldGhostHunter.cost,
//         Hand: [donaldGhostHunter],
//         Play: [goofyGhostHunter],
//       });
//
//       Const targetDetective = testEngine.getCardModel(goofyGhostHunter);
//       Expect(targetDetective.hasChallenger).toBe(false);
//
//       Await testEngine.playCard(donaldGhostHunter);
//       Await testEngine.resolveTopOfStack({ targets: [targetDetective] });
//
//       Expect(targetDetective.hasChallenger).toBe(true);
//     });
//
//     It("should allow Donald to target himself (he is a Detective)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: donaldGhostHunter.cost,
//         Hand: [donaldGhostHunter],
//       });
//
//       Await testEngine.playCard(donaldGhostHunter);
//       Const donaldModel = testEngine.getCardModel(donaldGhostHunter);
//
//       Await testEngine.resolveTopOfStack({ targets: [donaldModel] });
//
//       Expect(donaldModel.hasChallenger).toBe(true);
//     });
//
//     It("should only target Detective characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: donaldGhostHunter.cost,
//         Hand: [donaldGhostHunter],
//         Play: [goofyGhostHunter],
//       });
//
//       Const detective = testEngine.getCardModel(goofyGhostHunter);
//
//       Await testEngine.playCard(donaldGhostHunter);
//
//       // The ability should have targeting restrictions to Detective only
//       Const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
//       );
//
//       Expect(ability).toBeDefined();
//       If (ability && "target" in ability) {
//         Const target = ability.target as any;
//         Const detectiveFilter = target.filters?.find(
//           (f: any) =>
//             F.filter === "characteristics" && f.value.includes("detective"),
//         );
//         Expect(detectiveFilter).toBeDefined();
//       }
//     });
//
//     It("should grant Challenger +2 for the rest of the turn only", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: donaldGhostHunter.cost,
//         Hand: [donaldGhostHunter],
//         Play: [goofyGhostHunter],
//       });
//
//       Const targetDetective = testEngine.getCardModel(goofyGhostHunter);
//
//       Await testEngine.playCard(donaldGhostHunter);
//       Await testEngine.resolveTopOfStack({ targets: [targetDetective] });
//
//       Expect(targetDetective.hasChallenger).toBe(true);
//
//       // Pass to next turn
//       TestEngine.passTurn();
//
//       // Challenger +2 should be removed after turn ends
//       // (Duration is 'turn' which expires at end of turn)
//       Expect(targetDetective.hasChallenger).toBe(false);
//     });
//
//     It("should apply +2 strength when the Detective challenges", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: donaldGhostHunter.cost,
//           Hand: [donaldGhostHunter],
//           Play: [goofyGhostHunter],
//         },
//         {
//           Play: [goofyGhostHunter],
//         },
//       );
//
//       Const playerDetective = testEngine.getByZoneAndId(
//         "play",
//         GoofyGhostHunter.id,
//         "player_one",
//       );
//       Const opponentTarget = testEngine.getByZoneAndId(
//         "play",
//         GoofyGhostHunter.id,
//         "player_two",
//       );
//
//       Const baseStrength = playerDetective.strength;
//
//       Await testEngine.playCard(donaldGhostHunter);
//       Await testEngine.resolveTopOfStack({ targets: [playerDetective] });
//
//       // When challenging, should get +2 strength from Challenger +2
//       PlayerDetective.exert();
//       Await testEngine.challenge({
//         Attacker: playerDetective,
//         Defender: opponentTarget,
//       });
//
//       // Verify the challenger bonus is applied during challenge
//       Expect(playerDetective.hasChallenger).toBe(true);
//     });
//   });
//
//   Describe("RAISE A RUCKUS - Structure Tests", () => {
//     It("should have the ability defined with correct structure", () => {
//       Const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const abilityEffect = ability.effects[0] as any;
//         Expect(abilityEffect.type).toBe("ability");
//         Expect(abilityEffect.ability).toBe("challenger");
//         Expect(abilityEffect.duration).toBe("turn");
//       }
//     });
//
//     It("should grant Challenger +2", () => {
//       Const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const abilityEffect = ability.effects[0] as any;
//         Expect(abilityEffect.ability).toBe("challenger");
//         Expect(abilityEffect.amount).toBe(2);
//       }
//     });
//
//     It("should target Detective characters", () => {
//       Const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const abilityEffect = ability.effects[0] as any;
//         Const target = abilityEffect.target;
//         Expect(target).toBeDefined();
//         Expect(target.filters).toBeDefined();
//
//         Const hasDetectiveFilter = target.filters.some(
//           (f: any) =>
//             F.filter === "characteristics" && f.value.includes("detective"),
//         );
//         Expect(hasDetectiveFilter).toBe(true);
//       }
//     });
//
//     It("should trigger when you play this character", () => {
//       Const ability = donaldGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "RAISE A RUCKUS",
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
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [donaldGhostHunter],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(donaldGhostHunter);
//
//       Expect(cardUnderTest.strength).toBe(5);
//       Expect(cardUnderTest.willpower).toBe(4);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(4);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(donaldGhostHunter.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics for Detective synergy", () => {
//       Expect(donaldGhostHunter.characteristics).toEqual([
//         "dreamborn",
//         "hero",
//         "detective",
//       ]);
//     });
//
//     It("should be steel color", () => {
//       Expect(donaldGhostHunter.colors).toEqual(["steel"]);
//     });
//
//     It("should be common rarity", () => {
//       Expect(donaldGhostHunter.rarity).toBe("common");
//     });
//   });
// });
//
