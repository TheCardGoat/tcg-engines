import type { CharacterCard } from "@tcg/lorcana-types";

export const michaelDarlingPlayfulSwordsman: CharacterCard = {
  id: "6jf",
  cardType: "character",
  name: "Michael Darling",
  version: "Playful Swordsman",
  fullName: "Michael Darling - Playful Swordsman",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "006",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 111,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "1791b696efc7194f13104cd397919423568103fc",
  },
  classifications: ["Storyborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const michaelDarlingPlayfulSwordsman: LorcanitoCharacterCard = {
//   id: "zba",
//   name: "Michael Darling",
//   title: "Playful Swordsman",
//   characteristics: ["storyborn", "ally", "pirate"],
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Filipe Laurentino",
//   number: 111,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593025,
//   },
//   rarity: "common",
// };
//
