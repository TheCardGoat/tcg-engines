import type { CharacterCard } from "@tcg/lorcana-types";

export const kohutTrustedMarine: CharacterCard = {
  id: "1kt",
  cardType: "character",
  name: "Kohut",
  version: "Trusted Marine",
  fullName: "Kohut - Trusted Marine",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "006",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 178,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "ccc49ec3dc6fdfb401d2610c418b1da5fd819cbe",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const kohutTrustedMarine: LorcanitoCharacterCard = {
//   id: "dry",
//   name: "Kohut",
//   title: "Trusted Marine",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kevin Sidharta",
//   number: 178,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592024,
//   },
//   rarity: "common",
// };
//
