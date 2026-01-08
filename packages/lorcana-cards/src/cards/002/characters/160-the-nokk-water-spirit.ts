import type { CharacterCard } from "@tcg/lorcana-types";

export const theNokkWaterSpirit: CharacterCard = {
  id: "q84",
  cardType: "character",
  name: "The Nokk",
  version: "Water Spirit",
  fullName: "The Nokk - Water Spirit",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "002",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 160,
  inkable: true,
  externalIds: {
    ravensburger: "5e84bd330102f933591077e27d65cdc0c3dbfdf1",
  },
  abilities: [
    {
      id: "q84-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const theNokkWaterSpirit: LorcanitoCharacterCard = {
//   id: "vrs",
//
//   name: "The Nokk",
//   title: "Water Spirit",
//   characteristics: ["storyborn"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_",
//   type: "character",
//   abilities: [wardAbility],
//   flavour: "As elusive as water.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Hadjie Joos",
//   number: 160,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527768,
//   },
//   rarity: "common",
// };
//
