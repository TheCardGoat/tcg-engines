// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldGhostHunter,
//   MinnieMouseGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Minnie Mouse - Ghost Hunter", () => {
//   Describe("SEARCH THE SHADOWS - Behavioral Tests", () => {
//     It("should grant Alert to chosen Detective character when played", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: minnieMouseGhostHunter.cost,
//         Hand: [minnieMouseGhostHunter],
//         Play: [donaldGhostHunter],
//       });
//
//       Const targetDetective = testEngine.getCardModel(donaldGhostHunter);
//       Expect(targetDetective.hasAlert).toBe(false);
//
//       Await testEngine.playCard(minnieMouseGhostHunter);
//       Await testEngine.resolveTopOfStack({ targets: [targetDetective] });
//
//       // Donald should now have Alert
//       Expect(targetDetective.hasAlert).toBe(true);
//     });
//
//     It("should allow Minnie to target herself (she is a Detective)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: minnieMouseGhostHunter.cost,
//         Hand: [minnieMouseGhostHunter],
//       });
//
//       Await testEngine.playCard(minnieMouseGhostHunter);
//       Const minnieModel = testEngine.getCardModel(minnieMouseGhostHunter);
//
//       Await testEngine.resolveTopOfStack({ targets: [minnieModel] });
//
//       // Minnie should have Alert
//       Expect(minnieModel.hasAlert).toBe(true);
//     });
//
//     It("should only target Detective characters", () => {
//       Const ability = minnieMouseGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "SEARCH THE SHADOWS",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const alertEffect = ability.effects[0] as any;
//         Const target = alertEffect.target;
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
//     It("should grant Alert for the rest of the turn only", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: minnieMouseGhostHunter.cost,
//         Hand: [minnieMouseGhostHunter],
//         Play: [donaldGhostHunter],
//       });
//
//       Const targetDetective = testEngine.getCardModel(donaldGhostHunter);
//
//       Await testEngine.playCard(minnieMouseGhostHunter);
//       Await testEngine.resolveTopOfStack({ targets: [targetDetective] });
//
//       Expect(targetDetective.hasAlert).toBe(true);
//
//       // Pass to next turn
//       TestEngine.passTurn();
//
//       // Alert should be removed after turn ends (duration: "turn", until: true)
//       Expect(targetDetective.hasAlert).toBe(false);
//     });
//
//     It("should trigger when you play this character", () => {
//       Const ability = minnieMouseGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "SEARCH THE SHADOWS",
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
//   Describe("SEARCH THE SHADOWS - Structure Tests", () => {
//     It("should have the ability defined with correct structure", () => {
//       Const ability = minnieMouseGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "SEARCH THE SHADOWS",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const alertEffect = ability.effects[0] as any;
//         Expect(alertEffect.type).toBe("ability");
//         Expect(alertEffect.ability).toBe("alert");
//         Expect(alertEffect.duration).toBe("turn");
//         Expect(alertEffect.until).toBe(true);
//       }
//     });
//
//     It("should target Detective characters in play", () => {
//       Const ability = minnieMouseGhostHunter.abilities?.find(
//         (a) => "name" in a && a.name === "SEARCH THE SHADOWS",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const alertEffect = ability.effects[0] as any;
//         Const target = alertEffect.target;
//         Expect(target).toBeDefined();
//         Expect(target.type).toBe("card");
//         Expect(target.value).toBe(1);
//
//         Const hasZoneFilter = target.filters.some(
//           (f: any) => f.filter === "zone" && f.value === "play",
//         );
//         Const hasTypeFilter = target.filters.some(
//           (f: any) => f.filter === "type" && f.value === "character",
//         );
//         Const hasOwnerFilter = target.filters.some(
//           (f: any) => f.filter === "owner" && f.value === "self",
//         );
//
//         Expect(hasZoneFilter).toBe(true);
//         Expect(hasTypeFilter).toBe(true);
//         Expect(hasOwnerFilter).toBe(true);
//       }
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [minnieMouseGhostHunter],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(minnieMouseGhostHunter);
//
//       Expect(cardUnderTest.strength).toBe(2);
//       Expect(cardUnderTest.willpower).toBe(3);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(2);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(minnieMouseGhostHunter.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics for Detective synergy", () => {
//       Expect(minnieMouseGhostHunter.characteristics).toEqual([
//         "dreamborn",
//         "hero",
//         "detective",
//       ]);
//     });
//
//     It("should be steel color", () => {
//       Expect(minnieMouseGhostHunter.colors).toEqual(["steel"]);
//     });
//
//     It("should be common rarity", () => {
//       Expect(minnieMouseGhostHunter.rarity).toBe("common");
//     });
//   });
// });
//
