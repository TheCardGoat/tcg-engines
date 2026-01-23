import type { CharacterCard } from "@tcg/lorcana-types";

export const olafFriendlySnowman: CharacterCard = {
  id: "cul",
  cardType: "character",
  name: "Olaf",
  version: "Friendly Snowman",
  fullName: "Olaf - Friendly Snowman",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 52,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const olafFriendlySnowman: LorcanitoCharacterCard = {
//   id: "cul",
//   reprints: ["q9w"],
//   name: "Olaf",
//   title: "Friendly Snowman",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: '"I\'m Olaf and I like warm hugs!"',
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Giulia Riva",
//   number: 52,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 485381,
//   },
//   rarity: "uncommon",
// };
//
