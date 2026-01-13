import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianLadyOfTheLists: CharacterCard = {
  id: "o8f",
  cardType: "character",
  name: "Maid Marian",
  version: "Lady of the Lists",
  fullName: "Maid Marian - Lady of the Lists",
  inkType: ["amber"],
  franchise: "Robin Hood",
  set: "005",
  text: "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 22,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "57571ecd3d370c1f1730569862a57fdd14f9c28d",
  },
  abilities: [],
  classifications: ["Dreamborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacterLoseStrengthUntilNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const maidMarianLadyOfTheLists: LorcanitoCharacterCard = {
//   id: "wd5",
//   name: "Maid Marian",
//   title: "Lady of the Lists",
//   characteristics: ["dreamborn", "princess"],
//   text: "**IF IT PLEASES THE LADY** When you play this character, opposing character of your choice gets -5 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "IF THE LADY WANTS IT",
//       text: "When you play this character, opposing character of your choice gets -5 {S} until the start of your next turn.",
//       effects: [chosenOpposingCharacterLoseStrengthUntilNextTurn(5)],
//     },
//   ],
//   flavour: "And who might you be, my noble Knight and champion?",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 4,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Jenna Grey",
//   number: 22,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561948,
//   },
//   rarity: "uncommon",
// };
//
