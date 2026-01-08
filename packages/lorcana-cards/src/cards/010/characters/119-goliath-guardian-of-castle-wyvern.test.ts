// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   goliathGuardianOfCastleWyvern,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Goliath - Guardian of Castle Wyvern", () => {
//   it("Character should have correct base stats", async () => {
//     const testEngine = new TestEngine({
//       hand: [goliathGuardianOfCastleWyvern],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       goliathGuardianOfCastleWyvern.id,
//     );
//
//     // Check base stats
//     expect(cardUnderTest.cost).toBe(4);
//     expect(cardUnderTest.strength).toBe(5);
//     expect(cardUnderTest.willpower).toBe(5);
//     expect(cardUnderTest.lore).toBe(1);
//     expect(cardUnderTest.characteristics).toEqual([
//       "storyborn",
//       "hero",
//       "gargoyle",
//     ]);
//   });
//
//   it("Character can be played with correct cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: goliathGuardianOfCastleWyvern.cost,
//       hand: [goliathGuardianOfCastleWyvern],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       goliathGuardianOfCastleWyvern.id,
//     );
//
//     await testEngine.playCard(cardUnderTest);
//     const goliathInPlay = testEngine.getByZoneAndId(
//       "play",
//       goliathGuardianOfCastleWyvern.id,
//     );
//     expect(goliathInPlay.zone).toBe("play");
//   });
//
//   it("STONE BY DAY - Should have the STONE BY DAY ability defined", () => {
//     const stoneByDay = goliathGuardianOfCastleWyvern.abilities?.find(
//       (a) => "name" in a && a.name === "STONE BY DAY",
//     );
//
//     expect(stoneByDay).toBeDefined();
//
//     if (
//       stoneByDay &&
//       "conditions" in stoneByDay &&
//       Array.isArray(stoneByDay.conditions)
//     ) {
//       // Should have condition checking hand count >= 3
//       expect(stoneByDay.conditions).toHaveLength(1);
//       const condition = stoneByDay.conditions[0] as any;
//       expect(condition.type).toBe("filter");
//       expect(condition.comparison.operator).toBe("gte");
//       expect(condition.comparison.value).toBe(3);
//     }
//
//     if (
//       stoneByDay &&
//       "effects" in stoneByDay &&
//       Array.isArray(stoneByDay.effects)
//     ) {
//       // Should have restriction effect
//       expect(stoneByDay.effects).toHaveLength(1);
//       const effect = stoneByDay.effects[0] as any;
//       expect(effect.type).toBe("restriction");
//       expect(effect.restriction).toBe("ready");
//     }
//   });
//
//   it("BE CAREFUL, ALL OF YOU - Should have the BE CAREFUL, ALL OF YOU ability defined", () => {
//     const beCareful = goliathGuardianOfCastleWyvern.abilities?.find(
//       (a) => "name" in a && a.name === "BE CAREFUL, ALL OF YOU",
//     );
//
//     expect(beCareful).toBeDefined();
//     // Check that it has the correct structure for a triggered ability
//     expect(beCareful).toHaveProperty("name", "BE CAREFUL, ALL OF YOU");
//   });
//
//   it("BE CAREFUL, ALL OF YOU - Should have correct gargoyle filter", () => {
//     const beCareful = goliathGuardianOfCastleWyvern.abilities?.find(
//       (a) => "name" in a && a.name === "BE CAREFUL, ALL OF YOU",
//     );
//
//     expect(beCareful).toBeDefined();
//
//     if (
//       beCareful &&
//       "attackerFilter" in beCareful &&
//       Array.isArray(beCareful.attackerFilter)
//     ) {
//       // Should filter for owner and gargoyle characteristics
//       expect(beCareful.attackerFilter).toHaveLength(2);
//       const ownerFilter = beCareful.attackerFilter[0] as any;
//       const gargoyleFilter = beCareful.attackerFilter[1] as any;
//
//       expect(ownerFilter.filter).toBe("owner");
//       expect(ownerFilter.value).toBe("self");
//
//       expect(gargoyleFilter.filter).toBe("characteristics");
//       expect(gargoyleFilter.value).toEqual(["gargoyle"]);
//     }
//   });
//
//   it("Should have correct lore effect", () => {
//     const beCareful = goliathGuardianOfCastleWyvern.abilities?.find(
//       (a) => "name" in a && a.name === "BE CAREFUL, ALL OF YOU",
//     );
//
//     expect(beCareful).toBeDefined();
//
//     if (
//       beCareful &&
//       "effects" in beCareful &&
//       Array.isArray(beCareful.effects)
//     ) {
//       // Should have lore effect adding 1 lore
//       expect(beCareful.effects).toHaveLength(1);
//       const effect = beCareful.effects[0] as any;
//       expect(effect.type).toBe("lore");
//       expect(effect.modifier).toBe("add");
//       expect(effect.amount).toBe(1);
//       expect(effect.target.type).toBe("player");
//       expect(effect.target.value).toBe("self");
//     }
//   });
//
//   it("Should have both abilities present", () => {
//     expect(goliathGuardianOfCastleWyvern.abilities).toBeDefined();
//     expect(goliathGuardianOfCastleWyvern.abilities?.length).toBe(2);
//
//     const abilityNames = goliathGuardianOfCastleWyvern.abilities?.map((a) =>
//       "name" in a ? a.name : "unknown",
//     );
//
//     expect(abilityNames).toContain("BE CAREFUL, ALL OF YOU");
//     expect(abilityNames).toContain("STONE BY DAY");
//   });
// });
//
