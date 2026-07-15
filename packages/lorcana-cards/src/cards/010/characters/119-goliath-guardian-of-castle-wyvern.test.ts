// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoliathGuardianOfCastleWyvern,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goliath - Guardian of Castle Wyvern", () => {
//   It("Character should have correct base stats", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [goliathGuardianOfCastleWyvern],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       GoliathGuardianOfCastleWyvern.id,
//     );
//
//     // Check base stats
//     Expect(cardUnderTest.cost).toBe(4);
//     Expect(cardUnderTest.strength).toBe(5);
//     Expect(cardUnderTest.willpower).toBe(5);
//     Expect(cardUnderTest.lore).toBe(1);
//     Expect(cardUnderTest.characteristics).toEqual([
//       "storyborn",
//       "hero",
//       "gargoyle",
//     ]);
//   });
//
//   It("Character can be played with correct cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goliathGuardianOfCastleWyvern.cost,
//       Hand: [goliathGuardianOfCastleWyvern],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       GoliathGuardianOfCastleWyvern.id,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//     Const goliathInPlay = testEngine.getByZoneAndId(
//       "play",
//       GoliathGuardianOfCastleWyvern.id,
//     );
//     Expect(goliathInPlay.zone).toBe("play");
//   });
//
//   It("STONE BY DAY - Should have the STONE BY DAY ability defined", () => {
//     Const stoneByDay = goliathGuardianOfCastleWyvern.abilities?.find(
//       (a) => "name" in a && a.name === "STONE BY DAY",
//     );
//
//     Expect(stoneByDay).toBeDefined();
//
//     If (
//       StoneByDay &&
//       "conditions" in stoneByDay &&
//       Array.isArray(stoneByDay.conditions)
//     ) {
//       // Should have condition checking hand count >= 3
//       Expect(stoneByDay.conditions).toHaveLength(1);
//       Const condition = stoneByDay.conditions[0] as any;
//       Expect(condition.type).toBe("filter");
//       Expect(condition.comparison.operator).toBe("gte");
//       Expect(condition.comparison.value).toBe(3);
//     }
//
//     If (
//       StoneByDay &&
//       "effects" in stoneByDay &&
//       Array.isArray(stoneByDay.effects)
//     ) {
//       // Should have restriction effect
//       Expect(stoneByDay.effects).toHaveLength(1);
//       Const effect = stoneByDay.effects[0] as any;
//       Expect(effect.type).toBe("restriction");
//       Expect(effect.restriction).toBe("ready");
//     }
//   });
//
//   It("BE CAREFUL, ALL OF YOU - Should have the BE CAREFUL, ALL OF YOU ability defined", () => {
//     Const beCareful = goliathGuardianOfCastleWyvern.abilities?.find(
//       (a) => "name" in a && a.name === "BE CAREFUL, ALL OF YOU",
//     );
//
//     Expect(beCareful).toBeDefined();
//     // Check that it has the correct structure for a triggered ability
//     Expect(beCareful).toHaveProperty("name", "BE CAREFUL, ALL OF YOU");
//   });
//
//   It("BE CAREFUL, ALL OF YOU - Should have correct gargoyle filter", () => {
//     Const beCareful = goliathGuardianOfCastleWyvern.abilities?.find(
//       (a) => "name" in a && a.name === "BE CAREFUL, ALL OF YOU",
//     );
//
//     Expect(beCareful).toBeDefined();
//
//     If (
//       BeCareful &&
//       "attackerFilter" in beCareful &&
//       Array.isArray(beCareful.attackerFilter)
//     ) {
//       // Should filter for owner and gargoyle characteristics
//       Expect(beCareful.attackerFilter).toHaveLength(2);
//       Const ownerFilter = beCareful.attackerFilter[0] as any;
//       Const gargoyleFilter = beCareful.attackerFilter[1] as any;
//
//       Expect(ownerFilter.filter).toBe("owner");
//       Expect(ownerFilter.value).toBe("self");
//
//       Expect(gargoyleFilter.filter).toBe("characteristics");
//       Expect(gargoyleFilter.value).toEqual(["gargoyle"]);
//     }
//   });
//
//   It("Should have correct lore effect", () => {
//     Const beCareful = goliathGuardianOfCastleWyvern.abilities?.find(
//       (a) => "name" in a && a.name === "BE CAREFUL, ALL OF YOU",
//     );
//
//     Expect(beCareful).toBeDefined();
//
//     If (
//       BeCareful &&
//       "effects" in beCareful &&
//       Array.isArray(beCareful.effects)
//     ) {
//       // Should have lore effect adding 1 lore
//       Expect(beCareful.effects).toHaveLength(1);
//       Const effect = beCareful.effects[0] as any;
//       Expect(effect.type).toBe("lore");
//       Expect(effect.modifier).toBe("add");
//       Expect(effect.amount).toBe(1);
//       Expect(effect.target.type).toBe("player");
//       Expect(effect.target.value).toBe("self");
//     }
//   });
//
//   It("Should have both abilities present", () => {
//     Expect(goliathGuardianOfCastleWyvern.abilities).toBeDefined();
//     Expect(goliathGuardianOfCastleWyvern.abilities?.length).toBe(2);
//
//     Const abilityNames = goliathGuardianOfCastleWyvern.abilities?.map((a) =>
//       "name" in a ? a.name : "unknown",
//     );
//
//     Expect(abilityNames).toContain("BE CAREFUL, ALL OF YOU");
//     Expect(abilityNames).toContain("STONE BY DAY");
//   });
// });
//
