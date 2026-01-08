import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierSavvyOpportunist: CharacterCard = {
  id: "z5l",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Savvy Opportunist",
  fullName: "Dr. Facilier - Savvy Opportunist",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 38,
  inkable: true,
  externalIds: {
    ravensburger: "7eb3e95e745e4e80a3c3f2b46bce3df355e3acbf",
  },
  abilities: [
    {
      id: "z5l-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const drFacilierSavvyOpportunist: LorcanitoCharacterCard = {
//   id: "pda",
//
//   name: "Dr. Facilier",
//   title: "Savvy Opportunist",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
//   type: "character",
//   abilities: [evasiveAbility],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 4,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 38,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527731,
//   },
//   rarity: "common",
// };
//
