// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FlintheartGlomgoldSchemingBillionaire,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Flintheart Glomgold - Scheming Billionaire", () => {
//   It("Character should have correct base stats", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [flintheartGlomgoldSchemingBillionaire],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       FlintheartGlomgoldSchemingBillionaire.id,
//     );
//
//     // Check base stats
//     Expect(cardUnderTest.cost).toBe(4);
//     Expect(cardUnderTest.strength).toBe(1);
//     Expect(cardUnderTest.willpower).toBe(4);
//     Expect(cardUnderTest.lore).toBe(3);
//     Expect(cardUnderTest.characteristics).toEqual(["storyborn", "villain"]);
//   });
//
//   It("Character can be played with correct cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: flintheartGlomgoldSchemingBillionaire.cost,
//       Hand: [flintheartGlomgoldSchemingBillionaire],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       FlintheartGlomgoldSchemingBillionaire.id,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//     Const flintheartInPlay = testEngine.getByZoneAndId(
//       "play",
//       FlintheartGlomgoldSchemingBillionaire.id,
//     );
//     Expect(flintheartInPlay.zone).toBe("play");
//   });
//
//   It("Should have inkwell ability", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [flintheartGlomgoldSchemingBillionaire],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       FlintheartGlomgoldSchemingBillionaire.id,
//     );
//
//     Expect(cardUnderTest.inkwell).toBe(true);
//   });
//
//   It("TRY ME - Should have the ability defined", () => {
//     Const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     Expect(tryMe).toBeDefined();
//   });
//
//   It("TRY ME - Should have Ward ability effect", () => {
//     Const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     Expect(tryMe).toBeDefined();
//
//     If (
//       TryMe &&
//       "ability" in tryMe &&
//       TryMe.ability === "gain-ability" &&
//       "gainedAbility" in tryMe
//     ) {
//       // Should grant Ward ability
//       Expect((tryMe as any).gainedAbility.ability).toBe("ward");
//     }
//   });
//
//   It("TRY ME - Should target this character", () => {
//     Const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     Expect(tryMe).toBeDefined();
//
//     If (
//       TryMe &&
//       "ability" in tryMe &&
//       TryMe.ability === "gain-ability" &&
//       "target" in tryMe
//     ) {
//       // Should target this character
//       Expect((tryMe as any).target).toBeDefined();
//     }
//   });
//
//   It("TRY ME - Should have correct condition for cards under characters/locations", () => {
//     Const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     Expect(tryMe).toBeDefined();
//
//     If (tryMe && "conditions" in tryMe && Array.isArray(tryMe.conditions)) {
//       // Should have condition for cards under characters or locations
//       Expect(tryMe.conditions).toHaveLength(1);
//       Const condition = tryMe.conditions[0] as any;
//       Expect(condition.type).toBe("filter");
//       Expect(condition.comparison.operator).toBe("gte");
//       Expect(condition.comparison.value).toBe(1);
//
//       // Should filter for owner, type, zone, and has_card_under_them
//       Expect(condition.filters).toHaveLength(4);
//       Expect(condition.filters).toEqual(
//         Expect.arrayContaining([
//           Expect.objectContaining({ filter: "owner", value: "self" }),
//           Expect.objectContaining({
//             Filter: "type",
//             Value: ["character", "location"],
//           }),
//           Expect.objectContaining({ filter: "zone", value: "play" }),
//           Expect.objectContaining({
//             Filter: "has_card_under_them",
//             Comparison: { operator: "gte", value: 1 },
//           }),
//         ]),
//       );
//     }
//   });
//
//   It("Should have correct rarity and set info", () => {
//     Expect(flintheartGlomgoldSchemingBillionaire.rarity).toBe("uncommon");
//     Expect(flintheartGlomgoldSchemingBillionaire.set).toBe("010");
//     Expect(flintheartGlomgoldSchemingBillionaire.number).toBe(76);
//     Expect(flintheartGlomgoldSchemingBillionaire.inkwell).toBe(true);
//     Expect(flintheartGlomgoldSchemingBillionaire.colors).toEqual(["emerald"]);
//   });
//
//   It("Should have the TRY ME ability present", () => {
//     Expect(flintheartGlomgoldSchemingBillionaire.abilities).toBeDefined();
//     Expect(flintheartGlomgoldSchemingBillionaire.abilities?.length).toBe(1);
//
//     Const abilityNames = flintheartGlomgoldSchemingBillionaire.abilities?.map(
//       (a) => ("name" in a ? a.name : "unknown"),
//     );
//
//     Expect(abilityNames).toContain("TRY ME");
//   });
//
//   It("TRY ME - Should have correct text", () => {
//     Const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     Expect(tryMe).toBeDefined();
//     If (tryMe && "text" in tryMe) {
//       Expect(tryMe.text).toContain(
//         "While you have a character or location in play with a card under them",
//       );
//       Expect(tryMe.text).toContain("this character gains Ward");
//       Expect(tryMe.text).toContain(
//         "(Opponents can't choose them except to challenge.)",
//       );
//     }
//   });
//
//   It("Should have correct trigger text", () => {
//     Expect(flintheartGlomgoldSchemingBillionaire.text).toContain("TRY ME");
//     Expect(flintheartGlomgoldSchemingBillionaire.text).toContain(
//       "While you have a character or location in play with a card under them",
//     );
//     Expect(flintheartGlomgoldSchemingBillionaire.text).toContain(
//       "this character gains Ward",
//     );
//     Expect(flintheartGlomgoldSchemingBillionaire.text).toContain(
//       "(Opponents can't choose them except to challenge.)",
//     );
//   });
//
//   It("TRY ME - Should be a static ability", () => {
//     Const tryMe = flintheartGlomgoldSchemingBillionaire.abilities?.find(
//       (a) => "name" in a && a.name === "TRY ME",
//     );
//
//     Expect(tryMe).toBeDefined();
//     If (tryMe && "type" in tryMe) {
//       Expect(tryMe.type).toBe("static");
//     }
//   });
// });
//
