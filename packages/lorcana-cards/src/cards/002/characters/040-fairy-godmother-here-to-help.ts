import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherHereToHelp: CharacterCard = {
  id: "1in",
  cardType: "character",
  name: "Fairy Godmother",
  version: "Here to Help",
  fullName: "Fairy Godmother - Here to Help",
  inkType: ["amethyst"],
  franchise: "Cinderella",
  set: "002",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  cardNumber: 40,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "05786197e50f445226969ad966c718aad5208275",
  },
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const fairyGodmotherHereToHelp: LorcanitoCharacterCard = {
//   id: "foy",
//
//   name: "Fairy Godmother",
//   title: "Here to Help",
//   characteristics: ["storyborn", "ally", "fairy"],
//   type: "character",
//   flavour:
//     "Use a humdrum spell, and you'll end up with humdrum magic. I like my magic to have something special!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 7,
//   lore: 2,
//   illustrator: "Hedvig Häggman-Sund",
//   number: 40,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527733,
//   },
//   rarity: "uncommon",
// };
//
