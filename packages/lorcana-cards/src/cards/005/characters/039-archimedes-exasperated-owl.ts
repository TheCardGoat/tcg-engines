import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesExasperatedOwl: CharacterCard = {
  id: "12v",
  cardType: "character",
  name: "Archimedes",
  version: "Exasperated Owl",
  fullName: "Archimedes - Exasperated Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 39,
  inkable: true,
  externalIds: {
    ravensburger: "8c1eb6e2d2c4b6d20d3428c9522a8bb003976cda",
  },
  abilities: [
    {
      id: "12v-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const archimedesExasperatedOwl: LorcanitoCharacterCard = {
//   id: "fyr",
//   name: "Archimedes",
//   title: "Exasperated Owl",
//   characteristics: ["storyborn", "ally"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour:
//     "Hmph. What does an owl have to do to get a little peace and quite around here?",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Kendall Hale",
//   number: 39,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561467,
//   },
//   rarity: "common",
// };
//
