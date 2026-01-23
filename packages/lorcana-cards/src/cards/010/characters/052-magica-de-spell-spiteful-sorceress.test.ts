// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   magicaDeSpellSpitefulSorceress,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Magica De Spell - Spiteful Sorceress", () => {
//   it("Character should have correct base stats", async () => {
//     const testEngine = new TestEngine({
//       hand: [magicaDeSpellSpitefulSorceress],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       magicaDeSpellSpitefulSorceress.id,
//     );
//
//     // Check base stats
//     expect(cardUnderTest.cost).toBe(5);
//     expect(cardUnderTest.strength).toBe(3);
//     expect(cardUnderTest.willpower).toBe(6);
//     expect(cardUnderTest.lore).toBe(2);
//     expect(cardUnderTest.characteristics).toEqual([
//       "storyborn",
//       "villain",
//       "sorcerer",
//     ]);
//   });
//
//   it("Character can be played with correct cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: magicaDeSpellSpitefulSorceress.cost,
//       hand: [magicaDeSpellSpitefulSorceress],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       magicaDeSpellSpitefulSorceress.id,
//     );
//
//     await testEngine.playCard(cardUnderTest);
//     const magicaInPlay = testEngine.getByZoneAndId(
//       "play",
//       magicaDeSpellSpitefulSorceress.id,
//     );
//     expect(magicaInPlay.zone).toBe("play");
//   });
//
//   it("Should have inkwell ability", async () => {
//     const testEngine = new TestEngine({
//       hand: [magicaDeSpellSpitefulSorceress],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       magicaDeSpellSpitefulSorceress.id,
//     );
//
//     expect(cardUnderTest.inkwell).toBe(true);
//   });
//
//   it("MYSTICAL MANIPULATION - Should have the ability defined", () => {
//     const mysticalManipulation = magicaDeSpellSpitefulSorceress.abilities?.find(
//       (a) => "name" in a && a.name === "MYSTICAL MANIPULATION",
//     );
//
//     expect(mysticalManipulation).toBeDefined();
//   });
//
//   it("MYSTICAL MANIPULATION - Should have move damage effect", () => {
//     const mysticalManipulation = magicaDeSpellSpitefulSorceress.abilities?.find(
//       (a) => "name" in a && a.name === "MYSTICAL MANIPULATION",
//     );
//
//     expect(mysticalManipulation).toBeDefined();
//
//     if (
//       mysticalManipulation &&
//       "effects" in mysticalManipulation &&
//       Array.isArray(mysticalManipulation.effects)
//     ) {
//       // Should have move damage effect
//       expect(mysticalManipulation.effects).toHaveLength(1);
//       const effect = mysticalManipulation.effects[0] as any;
//       expect(effect.type).toBe("move-damage");
//       expect(effect.amount).toBe(1);
//       expect(effect.target).toBeDefined();
//       expect(effect.to).toBeDefined();
//     }
//   });
//
//   it("MYSTICAL MANIPULATION - Should be optional", () => {
//     const mysticalManipulation = magicaDeSpellSpitefulSorceress.abilities?.find(
//       (a) => "name" in a && a.name === "MYSTICAL MANIPULATION",
//     );
//
//     expect(mysticalManipulation).toBeDefined();
//     if (
//       mysticalManipulation &&
//       "optional" in mysticalManipulation &&
//       mysticalManipulation.optional !== undefined
//     ) {
//       expect(mysticalManipulation.optional).toBe(true);
//     }
//   });
//
//   it("Should have correct rarity and set info", () => {
//     expect(magicaDeSpellSpitefulSorceress.rarity).toBe("rare");
//     expect(magicaDeSpellSpitefulSorceress.set).toBe("010");
//     expect(magicaDeSpellSpitefulSorceress.number).toBe(52);
//     expect(magicaDeSpellSpitefulSorceress.inkwell).toBe(true);
//     expect(magicaDeSpellSpitefulSorceress.colors).toEqual(["amethyst"]);
//   });
//
//   it("Should have the MYSTICAL MANIPULATION ability present", () => {
//     expect(magicaDeSpellSpitefulSorceress.abilities).toBeDefined();
//     expect(magicaDeSpellSpitefulSorceress.abilities?.length).toBe(1);
//
//     const abilityNames = magicaDeSpellSpitefulSorceress.abilities?.map((a) =>
//       "name" in a ? a.name : "unknown",
//     );
//
//     expect(abilityNames).toContain("MYSTICAL MANIPULATION");
//   });
//
//   it("MYSTICAL MANIPULATION - Should have correct text", () => {
//     const mysticalManipulation = magicaDeSpellSpitefulSorceress.abilities?.find(
//       (a) => "name" in a && a.name === "MYSTICAL MANIPULATION",
//     );
//
//     expect(mysticalManipulation).toBeDefined();
//     if (mysticalManipulation && "text" in mysticalManipulation) {
//       expect(mysticalManipulation.text).toContain(
//         "Whenever you put a card under one of your characters or locations",
//       );
//       expect(mysticalManipulation.text).toContain(
//         "you may move 1 damage counter",
//       );
//       expect(mysticalManipulation.text).toContain(
//         "from chosen character to chosen opposing character",
//       );
//     }
//   });
//
//   it("Should have correct trigger text", () => {
//     expect(magicaDeSpellSpitefulSorceress.text).toContain(
//       "MYSTICAL MANIPULATION",
//     );
//     expect(magicaDeSpellSpitefulSorceress.text).toContain(
//       "Whenever you put a card under one of your characters or locations",
//     );
//     expect(magicaDeSpellSpitefulSorceress.text).toContain(
//       "you may move 1 damage counter",
//     );
//   });
// });
//
