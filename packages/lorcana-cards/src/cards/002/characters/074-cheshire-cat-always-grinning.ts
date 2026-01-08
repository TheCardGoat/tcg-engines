import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatAlwaysGrinning: CharacterCard = {
  id: "hl9",
  cardType: "character",
  name: "Cheshire Cat",
  version: "Always Grinning",
  fullName: "Cheshire Cat - Always Grinning",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "002",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 74,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "3f65d8ab4c005c12cadaad7de8ea54b0da6776d8",
  },
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const cheshireCatAlwaysGrinning: LorcanitoCharacterCard = {
//   id: "ctv",
//
//   name: "Cheshire Cat",
//   title: "Always Grinning",
//   characteristics: ["storyborn"],
//   type: "character",
//   flavour:
//     'Alice felt quite confused. "But I don\'t see much ink here at all. How can the flood still be changing the Inklands?" \\n\\n"Things are always changing, you know," said the Cat. "It would be quite a change if they didn\'t."',
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Alex Accorsi",
//   number: 74,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527271,
//   },
//   rarity: "uncommon",
// };
//
