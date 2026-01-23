import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyElegantSpaniel: CharacterCard = {
  id: "14v",
  cardType: "character",
  name: "Lady",
  version: "Elegant Spaniel",
  fullName: "Lady - Elegant Spaniel",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 100,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "934805edfc939c3c6e92fa8b34aca79d34855421",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileYouHaveACharacterNamedThisCharGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ladyElegantSpaniel: LorcanitoCharacterCard = {
//   id: "g9g",
//   name: "Lady",
//   title: "Elegant Spaniel",
//   characteristics: ["storyborn", "hero"],
//   text: "A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGets({
//       name: "A DOG'S LIFE",
//       text: "While you have a character named Tramp in play, this character gets +1 {L}.",
//       characterName: "Tramp",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Sara Leal (Loyal)",
//   number: 100,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618161,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
