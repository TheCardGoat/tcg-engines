import type { CharacterCard } from "@tcg/lorcana-types";

export const rajahGhostlyTiger: CharacterCard = {
  id: "1ba",
  cardType: "character",
  name: "Rajah",
  version: "Ghostly Tiger",
  fullName: "Rajah - Ghostly Tiger",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  text: "Vanish (When an opponent chooses this character for an action, banish them.)",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 62,
  inkable: true,
  externalIds: {
    ravensburger: "aa7759237b508c4b2e253ca43417ab8d26d6da36",
  },
  abilities: [
    {
      id: "1ba-1",
      type: "keyword",
      keyword: "Vanish",
      text: "Vanish",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { vanishAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const rajahGhostlyTiger: LorcanitoCharacterCard = {
//   id: "yk7",
//   name: "Rajah",
//   title: "Ghostly Tiger",
//   characteristics: ["dreamborn", "ally", "illusion"],
//   text: "Vanish",
//   type: "character",
//   abilities: [vanishAbility],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Andrea Femerstrand",
//   number: 62,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618172,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
