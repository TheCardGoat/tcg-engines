import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinGoat: CharacterCard = {
  id: "198",
  cardType: "character",
  name: "Merlin",
  version: "Goat",
  fullName: "Merlin - Goat",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "HERE I COME! When you play this character and when he leaves play, gain 1 lore.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 51,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a29eca3d8c2f7e753604eac2019e1eb7a21a01b2",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenPlayAndWhenLeaves } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const merlinGoat: LorcanitoCharacterCard = {
//   id: "r3h",
//
//   name: "Merlin",
//   title: "Goat",
//   characteristics: ["sorcerer", "storyborn", "mentor"],
//   text: "**HERE I COME!** When you play this character and when he leaves play, gain 1 lore.",
//   type: "character",
//   abilities: whenPlayAndWhenLeaves({
//     name: "Here I Come!",
//     text: "When you play this character and when he leaves play, gain 1 lore.",
//     effects: [
//       {
//         type: "lore",
//         modifier: "add",
//         amount: 1,
//         target: self,
//       },
//     ],
//   }),
//   flavour: "He always was a stubborn old goat.\n–Madam Mim",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   lore: 1,
//   illustrator: "S. Shaw / L. Giammichele",
//   number: 51,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 522719,
//   },
//   rarity: "uncommon",
// };
//
