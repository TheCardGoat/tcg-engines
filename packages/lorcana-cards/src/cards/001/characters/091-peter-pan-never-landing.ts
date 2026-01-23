import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanNeverLanding: CharacterCard = {
  id: "1g6",
  cardType: "character",
  name: "Peter Pan",
  version: "Never Landing",
  fullName: "Peter Pan - Never Landing",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 91,
  inkable: true,
  externalIds: {
    ravensburger: "bdb08565784cd7012548f33dfb41c5f27b8bf8f7",
  },
  abilities: [
    {
      id: "1g6-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const peterPanNeverLanding: LorcanitoCharacterCard = {
//   id: "o91",
//   name: "Peter Pan",
//   title: "Never Landing",
//   characteristics: ["hero", "dreamborn"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour: "What's the matter, Hook? Can't you fly?",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Koni",
//   number: 91,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 502535,
//   },
//   rarity: "common",
// };
//
