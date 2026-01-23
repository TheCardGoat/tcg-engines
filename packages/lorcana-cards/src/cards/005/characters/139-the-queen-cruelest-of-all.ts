import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenCruelestOfAll: CharacterCard = {
  id: "s28",
  cardType: "character",
  name: "The Queen",
  version: "Cruelest of All",
  fullName: "The Queen - Cruelest of All",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 139,
  inkable: true,
  externalIds: {
    ravensburger: "6522f49b10eefa0162d9f38ed91efba1027e5efc",
  },
  abilities: [
    {
      id: "s28-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const theQueenCruelestOfAll: LorcanitoCharacterCard = {
//   id: "mjg",
//   name: "The Queen",
//   title: "Cruelest of All",
//   characteristics: ["queen", "sorcerer", "storyborn", "villain"],
//   text: "**Ward** _(Opponents can’t choose this character except to challenge.)_",
//   type: "character",
//   abilities: [wardAbility],
//   flavour:
//     "She’d seen what the ink could do for other glimmers. What could it do for her?",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   willpower: 4,
//   strength: 0,
//   lore: 1,
//   illustrator: "Carmine Pucci",
//   number: 139,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561641,
//   },
//   rarity: "common",
// };
//
