import type { CharacterCard } from "@tcg/lorcana-types";

export const tootlesLostBoy: CharacterCard = {
  id: "8zv",
  cardType: "character",
  name: "Tootles",
  version: "Lost Boy",
  fullName: "Tootles - Lost Boy",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 76,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "206cb5dd9b005f75a17ff692982bd3e009e51812",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const tootlesLostBoy: LorcanitoCharacterCard = {
//   id: "rad",
//   name: "Tootles",
//   title: "Lost Boy",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Taranesh",
//   number: 76,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588068,
//   },
//   rarity: "common",
// };
//
