// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilTenaciousMouse,
//   DavidXanatosSteelClanLeader,
//   DonaldGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("David Xanatos - Steel Clan Leader", () => {
//   Describe("MINOR INCONVENIENCE - Behavioral Tests", () => {
//     It("should deal 2 damage to chosen character after discarding a card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: davidXanatosSteelClanLeader.cost,
//           Hand: [davidXanatosSteelClanLeader, basilTenaciousMouse],
//         },
//         {
//           Play: [donaldGhostHunter],
//         },
//       );
//
//       Const targetCharacter = testEngine.getByZoneAndId(
//         "play",
//         DonaldGhostHunter.id,
//         "player_two",
//       );
//       Const initialDamage = targetCharacter.damage;
//
//       Await testEngine.playCard(davidXanatosSteelClanLeader);
//
//       // Accept the optional ability
//       Await testEngine.acceptOptionalLayer();
//
//       // The effects are resolved individually with dependent effects
//       // First resolve discard effect
//       Const cardToDiscard = testEngine.getByZoneAndId(
//         "hand",
//         BasilTenaciousMouse.id,
//         "player_one",
//       );
//       Await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // Then resolve damage effect
//       Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//       // Verify damage was dealt
//       Expect(targetCharacter.damage).toBe(initialDamage + 2);
//
//       // Verify card was discarded
//       Expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
//     });
//
//     It("should allow declining the optional ability", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: davidXanatosSteelClanLeader.cost,
//           Hand: [davidXanatosSteelClanLeader, basilTenaciousMouse],
//         },
//         {
//           Play: [donaldGhostHunter],
//         },
//       );
//
//       Const targetCharacter = testEngine.getByZoneAndId(
//         "play",
//         DonaldGhostHunter.id,
//         "player_two",
//       );
//       Const initialDamage = targetCharacter.damage;
//
//       Await testEngine.playCard(davidXanatosSteelClanLeader);
//
//       // Skip the optional ability
//       Await testEngine.skipTopOfStack();
//
//       // No damage should be dealt
//       Expect(targetCharacter.damage).toBe(initialDamage);
//
//       // No cards should be discarded
//       Expect(testEngine.getZonesCardCount("player_one").discard).toBe(0);
//     });
//
//     It("should trigger when you play this character", () => {
//       Const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
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
//       Const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       Expect(ability).toBeDefined();
//       If (ability && "optional" in ability) {
//         Expect(ability.optional).toBe(true);
//       }
//     });
//   });
//
//   Describe("MINOR INCONVENIENCE - Structure Tests", () => {
//     It("should have damage and discard effects", () => {
//       Const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Expect(ability.effects.length).toBe(2);
//
//         Const damageEffect = ability.effects.find(
//           (e: any) => e.type === "damage",
//         );
//         Const discardEffect = ability.effects.find(
//           (e: any) => e.type === "discard",
//         );
//
//         Expect(damageEffect).toBeDefined();
//         Expect(discardEffect).toBeDefined();
//       }
//     });
//
//     It("should deal 2 damage", () => {
//       Const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const damageEffect = ability.effects.find(
//           (e: any) => e.type === "damage",
//         ) as any;
//
//         Expect(damageEffect.amount).toBe(2);
//       }
//     });
//
//     It("should discard 1 card from hand", () => {
//       Const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const discardEffect = ability.effects.find(
//           (e: any) => e.type === "discard",
//         ) as any;
//
//         Expect(discardEffect.amount).toBe(1);
//         Expect(discardEffect.target).toBeDefined();
//
//         Const hasHandFilter = discardEffect.target.filters.some(
//           (f: any) => f.filter === "zone" && f.value === "hand",
//         );
//         Const hasOwnerFilter = discardEffect.target.filters.some(
//           (f: any) => f.filter === "owner" && f.value === "self",
//         );
//
//         Expect(hasHandFilter).toBe(true);
//         Expect(hasOwnerFilter).toBe(true);
//       }
//     });
//
//     It("should target any character in play", () => {
//       Const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       Expect(ability).toBeDefined();
//
//       If (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         Const damageEffect = ability.effects.find(
//           (e: any) => e.type === "damage",
//         ) as any;
//
//         Const target = damageEffect.target;
//         Expect(target).toBeDefined();
//         Expect(target.type).toBe("card");
//         Expect(target.value).toBe(1);
//
//         Const hasTypeFilter = target.filters.some(
//           (f: any) => f.filter === "type" && f.value === "character",
//         );
//         Const hasZoneFilter = target.filters.some(
//           (f: any) => f.filter === "zone" && f.value === "play",
//         );
//
//         Expect(hasTypeFilter).toBe(true);
//         Expect(hasZoneFilter).toBe(true);
//       }
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [davidXanatosSteelClanLeader],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         DavidXanatosSteelClanLeader,
//       );
//
//       Expect(cardUnderTest.strength).toBe(3);
//       Expect(cardUnderTest.willpower).toBe(2);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(3);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(davidXanatosSteelClanLeader.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(davidXanatosSteelClanLeader.characteristics).toEqual([
//         "storyborn",
//         "villain",
//       ]);
//     });
//
//     It("should be steel color", () => {
//       Expect(davidXanatosSteelClanLeader.colors).toEqual(["steel"]);
//     });
//
//     It("should be uncommon rarity", () => {
//       Expect(davidXanatosSteelClanLeader.rarity).toBe("uncommon");
//     });
//   });
// });
//
