import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaMadSeaWitch: CharacterCard = {
  id: "ui8",
  cardType: "character",
  name: "Ursula",
  version: "Mad Sea Witch",
  fullName: "Ursula - Mad Sea Witch",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 57,
  inkable: true,
  externalIds: {
    ravensburger: "6df2820402c29a10e4294b8b6703f720b6211791",
  },
  abilities: [
    {
      id: "ui8-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const ursulaMadSeaWitch: LorcanitoCharacterCard = {
//   id: "l0q",
//   name: "Ursula",
//   title: "Mad Sea Witch",
//   characteristics: ["dreamborn", "sorcerer", "villain"],
//   text: "**Challenger +2** _(While challenging, this character gets +2 {S}.)_",
//   type: "character",
//   abilities: [challengerAbility(2)],
//   flavour:
//     "After her, Flotsam! I can't rule Lorcana without the Hexwell Crown!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Adam Ford",
//   number: 57,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550570,
//   },
//   rarity: "uncommon",
// };
//
