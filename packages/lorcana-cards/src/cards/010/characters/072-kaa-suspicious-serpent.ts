import type { CharacterCard } from "@tcg/lorcana-types";

export const kaaSuspiciousSerpent: CharacterCard = {
  id: "xkn",
  cardType: "character",
  name: "Kaa",
  version: "Suspicious Serpent",
  fullName: "Kaa - Suspicious Serpent",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 72,
  inkable: true,
  externalIds: {
    ravensburger: "790085a5369b1cc854dd2c964ca6e879be2e2a56",
  },
  abilities: [
    {
      id: "xkn-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const kaaSuspiciousSerpent: LorcanitoCharacterCard = {
//   id: "z9d",
//   name: "Kaa",
//   title: "Suspicious Serpent",
//   characteristics: ["storyborn", "villain"],
//   text: "Ward (Opponents can't choose this character except to challenge.)",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Sergio Mancinelli",
//   number: 72,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660038,
//   },
//   rarity: "common",
//   abilities: [wardAbility],
//   lore: 2,
// };
//
