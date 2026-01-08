// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   flintheartGlomgoldSchemingBillionaire,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Flintheart Glomgold - Scheming Billionaire", () => {
//   it("Character should have correct base stats", async () => {
//     const testEngine = new TestEngine({
//       hand: [flintheartGlomgoldSchemingBillionaire],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       flintheartGlomgoldSchemingBillionaire.id,
//     );
//
//     // Check base stats
//     expect(cardUnderTest.cost).toBe(4);
//     expect(cardUnderTest.strength).toBe(1);
//     expect(cardUnderTest.willpower).toBe(4);
//     expect(cardUnderTest.lore).toBe(3);
//     expect(cardUnderTest.characteristics).toEqual(["storyborn", "villain"]);
//   });
//
//   it("Character can be played with correct cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: flintheartGlomgoldSchemingBillionaire.cost,
//       hand: [flintheartGlomgoldSchemingBillionaire],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       flintheartGlomgoldSchemingBillionaire.id,
//     );
//
//     await testEngine.playCard(cardUnderTest);
//     const flintheartInPlay = testEngine.getByZoneAndId(
//       "play",
//       flintheartGlomgoldSchemingBillionaire.id,
//     );
//     expect(flintheartInPlay.zone).toBe("play");
//   });
//
//   it("Should have inkwell ability", async () => {
//     const testEngine = new TestEngine({
//       hand: [flintheartGlomgoldSchemingBillionaire],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       flintheartGlomgoldSchemingBillionaire.id,
//     );
//
//     expect(cardUnderTest.inkwell).toBe(true);
//   });
//
//   it("TRY ME - Should have the ability defined", () => {
//     const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     expect(tryMe).toBeDefined();
//   });
//
//   it("TRY ME - Should have Ward ability effect", () => {
//     const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     expect(tryMe).toBeDefined();
//
//     if (
//       tryMe &&
//       "ability" in tryMe &&
//       tryMe.ability === "gain-ability" &&
//       "gainedAbility" in tryMe
//     ) {
//       // Should grant Ward ability
//       expect((tryMe as any).gainedAbility.ability).toBe("ward");
//     }
//   });
//
//   it("TRY ME - Should target this character", () => {
//     const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     expect(tryMe).toBeDefined();
//
//     if (
//       tryMe &&
//       "ability" in tryMe &&
//       tryMe.ability === "gain-ability" &&
//       "target" in tryMe
//     ) {
//       // Should target this character
//       expect((tryMe as any).target).toBeDefined();
//     }
//   });
//
//   it("TRY ME - Should have correct condition for cards under characters/locations", () => {
//     const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     expect(tryMe).toBeDefined();
//
//     if (tryMe && "conditions" in tryMe && Array.isArray(tryMe.conditions)) {
//       // Should have condition for cards under characters or locations
//       expect(tryMe.conditions).toHaveLength(1);
//       const condition = tryMe.conditions[0] as any;
//       expect(condition.type).toBe("filter");
//       expect(condition.comparison.operator).toBe("gte");
//       expect(condition.comparison.value).toBe(1);
//
//       // Should filter for owner, type, zone, and has_card_under_them
//       expect(condition.filters).toHaveLength(4);
//       expect(condition.filters).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({ filter: "owner", value: "self" }),
//           expect.objectContaining({
//             filter: "type",
//             value: ["character", "location"],
//           }),
//           expect.objectContaining({ filter: "zone", value: "play" }),
//           expect.objectContaining({
//             filter: "has_card_under_them",
//             comparison: { operator: "gte", value: 1 },
//           }),
//         ]),
//       );
//     }
//   });
//
//   it("Should have correct rarity and set info", () => {
//     expect(flintheartGlomgoldSchemingBillionaire.rarity).toBe("uncommon");
//     expect(flintheartGlomgoldSchemingBillionaire.set).toBe("010");
//     expect(flintheartGlomgoldSchemingBillionaire.number).toBe(76);
//     expect(flintheartGlomgoldSchemingBillionaire.inkwell).toBe(true);
//     expect(flintheartGlomgoldSchemingBillionaire.colors).toEqual(["emerald"]);
//   });
//
//   it("Should have the TRY ME ability present", () => {
//     expect(flintheartGlomgoldSchemingBillionaire.abilities).toBeDefined();
//     expect(flintheartGlomgoldSchemingBillionaire.abilities?.length).toBe(1);
//
//     const abilityNames = flintheartGlomgoldSchemingBillionaire.abilities?.map(
//       (a) => ("name" in a ? a.name : "unknown"),
//     );
//
//     expect(abilityNames).toContain("TRY ME");
//   });
//
//   it("TRY ME - Should have correct text", () => {
//     const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     expect(tryMe).toBeDefined();
//     if (tryMe && "text" in tryMe) {
//       expect(tryMe.text).toContain(
//         "While you have a character or location in play with a card under them",
//       );
//       expect(tryMe.text).toContain("this character gains Ward");
//       expect(tryMe.text).toContain(
//         "(Opponents can't choose them except to challenge.)",
//       );
//     }
//   });
//
//   it("Should have correct trigger text", () => {
//     expect(flintheartGlomgoldSchemingBillionaire.text).toContain("TRY ME");
//     expect(flintheartGlomgoldSchemingBillionaire.text).toContain(
//       "While you have a character or location in play with a card under them",
//     );
//     expect(flintheartGlomgoldSchemingBillionaire.text).toContain(
//       "this character gains Ward",
//     );
//     expect(flintheartGlomgoldSchemingBillionaire.text).toContain(
//       "(Opponents can't choose them except to challenge.)",
//     );
//   });
//
//   it("TRY ME - Should be a static ability", () => {
//     const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     expect(tryMe).toBeDefined();
//     if (tryMe && "type" in tryMe) {
//       expect(tryMe.type).toBe("static");
//     }
//   });
// });
//
