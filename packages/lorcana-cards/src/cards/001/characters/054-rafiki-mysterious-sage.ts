import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiMysteriousSage: CharacterCard = {
  id: "zqh",
  cardType: "character",
  name: "Rafiki",
  version: "Mysterious Sage",
  fullName: "Rafiki - Mysterious Sage",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 54,
  inkable: false,
  externalIds: {
    ravensburger: "80caf60ae34281409e8e7afd88224c417a282bac",
  },
  abilities: [
    {
      id: "zqh-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const rafikiMysterious: LorcanitoCharacterCard = {
//   id: "v97",
//   name: "Rafiki",
//   title: "Mysterious Sage",
//   characteristics: ["dreamborn", "sorcerer", "mentor"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_",
//   type: "character",
//   abilities: [rushAbility],
//   flavour:
//     "The past can hurt. But the way I see it, you can either run from it or learn from it.",
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Giulia Riva",
//   number: 54,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 501405,
//   },
//   rarity: "uncommon",
// };
//
