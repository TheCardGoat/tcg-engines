// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MagicaDeSpellSpitefulSorceress,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Magica De Spell - Spiteful Sorceress", () => {
//   It("Character should have correct base stats", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [magicaDeSpellSpitefulSorceress],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       MagicaDeSpellSpitefulSorceress.id,
//     );
//
//     // Check base stats
//     Expect(cardUnderTest.cost).toBe(5);
//     Expect(cardUnderTest.strength).toBe(3);
//     Expect(cardUnderTest.willpower).toBe(6);
//     Expect(cardUnderTest.lore).toBe(2);
//     Expect(cardUnderTest.characteristics).toEqual([
//       "storyborn",
//       "villain",
//       "sorcerer",
//     ]);
//   });
//
//   It("Character can be played with correct cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicaDeSpellSpitefulSorceress.cost,
//       Hand: [magicaDeSpellSpitefulSorceress],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       MagicaDeSpellSpitefulSorceress.id,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//     Const magicaInPlay = testEngine.getByZoneAndId(
//       "play",
//       MagicaDeSpellSpitefulSorceress.id,
//     );
//     Expect(magicaInPlay.zone).toBe("play");
//   });
//
//   It("Should have inkwell ability", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [magicaDeSpellSpitefulSorceress],
//     });
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       MagicaDeSpellSpitefulSorceress.id,
//     );
//
//     Expect(cardUnderTest.inkwell).toBe(true);
//   });
//
//   It("MYSTICAL MANIPULATION - Should have the ability defined", () => {
//     Const mysticalManipulation = magicaDeSpellSpitefulSorceress.abilities?.find(
//       (a) => "name" in a && a.name === "MYSTICAL MANIPULATION",
//     );
//
//     Expect(mysticalManipulation).toBeDefined();
//   });
//
//   It("MYSTICAL MANIPULATION - Should have move damage effect", () => {
//     Const mysticalManipulation = magicaDeSpellSpitefulSorceress.abilities?.find(
//       (a) => "name" in a && a.name === "MYSTICAL MANIPULATION",
//     );
//
//     Expect(mysticalManipulation).toBeDefined();
//
//     If (
//       MysticalManipulation &&
//       "effects" in mysticalManipulation &&
//       Array.isArray(mysticalManipulation.effects)
//     ) {
//       // Should have move damage effect
//       Expect(mysticalManipulation.effects).toHaveLength(1);
//       Const effect = mysticalManipulation.effects[0] as any;
//       Expect(effect.type).toBe("move-damage");
//       Expect(effect.amount).toBe(1);
//       Expect(effect.target).toBeDefined();
//       Expect(effect.to).toBeDefined();
//     }
//   });
//
//   It("MYSTICAL MANIPULATION - Should be optional", () => {
//     Const mysticalManipulation = magicaDeSpellSpitefulSorceress.abilities?.find(
//       (a) => "name" in a && a.name === "MYSTICAL MANIPULATION",
//     );
//
//     Expect(mysticalManipulation).toBeDefined();
//     If (
//       MysticalManipulation &&
//       "optional" in mysticalManipulation &&
//       MysticalManipulation.optional !== undefined
//     ) {
//       Expect(mysticalManipulation.optional).toBe(true);
//     }
//   });
//
//   It("Should have correct rarity and set info", () => {
//     Expect(magicaDeSpellSpitefulSorceress.rarity).toBe("rare");
//     Expect(magicaDeSpellSpitefulSorceress.set).toBe("010");
//     Expect(magicaDeSpellSpitefulSorceress.number).toBe(52);
//     Expect(magicaDeSpellSpitefulSorceress.inkwell).toBe(true);
//     Expect(magicaDeSpellSpitefulSorceress.colors).toEqual(["amethyst"]);
//   });
//
//   It("Should have the MYSTICAL MANIPULATION ability present", () => {
//     Expect(magicaDeSpellSpitefulSorceress.abilities).toBeDefined();
//     Expect(magicaDeSpellSpitefulSorceress.abilities?.length).toBe(1);
//
//     Const abilityNames = magicaDeSpellSpitefulSorceress.abilities?.map((a) =>
//       "name" in a ? a.name : "unknown",
//     );
//
//     Expect(abilityNames).toContain("MYSTICAL MANIPULATION");
//   });
//
//   It("MYSTICAL MANIPULATION - Should have correct text", () => {
//     Const mysticalManipulation = magicaDeSpellSpitefulSorceress.abilities?.find(
//       (a) => "name" in a && a.name === "MYSTICAL MANIPULATION",
//     );
//
//     Expect(mysticalManipulation).toBeDefined();
//     If (mysticalManipulation && "text" in mysticalManipulation) {
//       Expect(mysticalManipulation.text).toContain(
//         "Whenever you put a card under one of your characters or locations",
//       );
//       Expect(mysticalManipulation.text).toContain(
//         "you may move 1 damage counter",
//       );
//       Expect(mysticalManipulation.text).toContain(
//         "from chosen character to chosen opposing character",
//       );
//     }
//   });
//
//   It("Should have correct trigger text", () => {
//     Expect(magicaDeSpellSpitefulSorceress.text).toContain(
//       "MYSTICAL MANIPULATION",
//     );
//     Expect(magicaDeSpellSpitefulSorceress.text).toContain(
//       "Whenever you put a card under one of your characters or locations",
//     );
//     Expect(magicaDeSpellSpitefulSorceress.text).toContain(
//       "you may move 1 damage counter",
//     );
//   });
// });
//
