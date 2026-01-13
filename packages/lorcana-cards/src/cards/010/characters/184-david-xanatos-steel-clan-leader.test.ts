// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   basilTenaciousMouse,
//   davidXanatosSteelClanLeader,
//   donaldGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("David Xanatos - Steel Clan Leader", () => {
//   describe("MINOR INCONVENIENCE - Behavioral Tests", () => {
//     it("should deal 2 damage to chosen character after discarding a card", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: davidXanatosSteelClanLeader.cost,
//           hand: [davidXanatosSteelClanLeader, basilTenaciousMouse],
//         },
//         {
//           play: [donaldGhostHunter],
//         },
//       );
//
//       const targetCharacter = testEngine.getByZoneAndId(
//         "play",
//         donaldGhostHunter.id,
//         "player_two",
//       );
//       const initialDamage = targetCharacter.damage;
//
//       await testEngine.playCard(davidXanatosSteelClanLeader);
//
//       // Accept the optional ability
//       await testEngine.acceptOptionalLayer();
//
//       // The effects are resolved individually with dependent effects
//       // First resolve discard effect
//       const cardToDiscard = testEngine.getByZoneAndId(
//         "hand",
//         basilTenaciousMouse.id,
//         "player_one",
//       );
//       await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // Then resolve damage effect
//       await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//       // Verify damage was dealt
//       expect(targetCharacter.damage).toBe(initialDamage + 2);
//
//       // Verify card was discarded
//       expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
//     });
//
//     it("should allow declining the optional ability", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: davidXanatosSteelClanLeader.cost,
//           hand: [davidXanatosSteelClanLeader, basilTenaciousMouse],
//         },
//         {
//           play: [donaldGhostHunter],
//         },
//       );
//
//       const targetCharacter = testEngine.getByZoneAndId(
//         "play",
//         donaldGhostHunter.id,
//         "player_two",
//       );
//       const initialDamage = targetCharacter.damage;
//
//       await testEngine.playCard(davidXanatosSteelClanLeader);
//
//       // Skip the optional ability
//       await testEngine.skipTopOfStack();
//
//       // No damage should be dealt
//       expect(targetCharacter.damage).toBe(initialDamage);
//
//       // No cards should be discarded
//       expect(testEngine.getZonesCardCount("player_one").discard).toBe(0);
//     });
//
//     it("should trigger when you play this character", () => {
//       const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
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
//       const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       expect(ability).toBeDefined();
//       if (ability && "optional" in ability) {
//         expect(ability.optional).toBe(true);
//       }
//     });
//   });
//
//   describe("MINOR INCONVENIENCE - Structure Tests", () => {
//     it("should have damage and discard effects", () => {
//       const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         expect(ability.effects.length).toBe(2);
//
//         const damageEffect = ability.effects.find(
//           (e: any) => e.type === "damage",
//         );
//         const discardEffect = ability.effects.find(
//           (e: any) => e.type === "discard",
//         );
//
//         expect(damageEffect).toBeDefined();
//         expect(discardEffect).toBeDefined();
//       }
//     });
//
//     it("should deal 2 damage", () => {
//       const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const damageEffect = ability.effects.find(
//           (e: any) => e.type === "damage",
//         ) as any;
//
//         expect(damageEffect.amount).toBe(2);
//       }
//     });
//
//     it("should discard 1 card from hand", () => {
//       const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const discardEffect = ability.effects.find(
//           (e: any) => e.type === "discard",
//         ) as any;
//
//         expect(discardEffect.amount).toBe(1);
//         expect(discardEffect.target).toBeDefined();
//
//         const hasHandFilter = discardEffect.target.filters.some(
//           (f: any) => f.filter === "zone" && f.value === "hand",
//         );
//         const hasOwnerFilter = discardEffect.target.filters.some(
//           (f: any) => f.filter === "owner" && f.value === "self",
//         );
//
//         expect(hasHandFilter).toBe(true);
//         expect(hasOwnerFilter).toBe(true);
//       }
//     });
//
//     it("should target any character in play", () => {
//       const ability = davidXanatosSteelClanLeader.abilities?.find(
//         (a) => "name" in a && a.name === "MINOR INCONVENIENCE",
//       );
//
//       expect(ability).toBeDefined();
//
//       if (ability && "effects" in ability && Array.isArray(ability.effects)) {
//         const damageEffect = ability.effects.find(
//           (e: any) => e.type === "damage",
//         ) as any;
//
//         const target = damageEffect.target;
//         expect(target).toBeDefined();
//         expect(target.type).toBe("card");
//         expect(target.value).toBe(1);
//
//         const hasTypeFilter = target.filters.some(
//           (f: any) => f.filter === "type" && f.value === "character",
//         );
//         const hasZoneFilter = target.filters.some(
//           (f: any) => f.filter === "zone" && f.value === "play",
//         );
//
//         expect(hasTypeFilter).toBe(true);
//         expect(hasZoneFilter).toBe(true);
//       }
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [davidXanatosSteelClanLeader],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         davidXanatosSteelClanLeader,
//       );
//
//       expect(cardUnderTest.strength).toBe(3);
//       expect(cardUnderTest.willpower).toBe(2);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should be inkwell card", () => {
//       expect(davidXanatosSteelClanLeader.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(davidXanatosSteelClanLeader.characteristics).toEqual([
//         "storyborn",
//         "villain",
//       ]);
//     });
//
//     it("should be steel color", () => {
//       expect(davidXanatosSteelClanLeader.colors).toEqual(["steel"]);
//     });
//
//     it("should be uncommon rarity", () => {
//       expect(davidXanatosSteelClanLeader.rarity).toBe("uncommon");
//     });
//   });
// });
//
