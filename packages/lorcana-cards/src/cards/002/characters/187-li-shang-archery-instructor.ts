import type { CharacterCard } from "@tcg/lorcana-types";

export const liShangArcheryInstructor: CharacterCard = {
  id: "1eu",
  cardType: "character",
  name: "Li Shang",
  version: "Archery Instructor",
  fullName: "Li Shang - Archery Instructor",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "002",
  text: "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn. (They can challenge characters with Evasive.)",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 187,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b7376a880042a6d1090a8b02680975f23786dc0a",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { allYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const liShangArcheryInstructor: LorcanitoCharacterCard = {
//   id: "vg7",
//
//   name: "Li Shang",
//   title: "Archery Instructor",
//   characteristics: ["hero", "storyborn"],
//   text: "**ARCHERY LESSON** Whenever this character quests, your characters gain **Evasive** this turn. _(They can challenge characters with Evasive.)_",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Archery Lesson",
//       text: "Whenever this character quests, your characters gain **Evasive** this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "turn",
//           target: allYourCharacters,
//         } as AbilityEffect,
//       ],
//     }),
//   ],
//   flavour: "Learn what to do, then learn to do it without thought.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Cristian Romero",
//   number: 187,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 523755,
//   },
//   rarity: "uncommon",
// };
//
