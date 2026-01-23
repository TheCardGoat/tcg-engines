import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanSoldierInTraining: CharacterCard = {
  id: "x7m",
  cardType: "character",
  name: "Mulan",
  version: "Soldier in Training",
  fullName: "Mulan - Soldier in Training",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "002",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 117,
  inkable: false,
  externalIds: {
    ravensburger: "77b270ef01a1671fcf0123fc2f0dceb294777022",
  },
  abilities: [
    {
      id: "x7m-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const mulanSoldierInTraining: LorcanitoCharacterCard = {
//   id: "tzn",
//   name: "Mulan",
//   title: "Soldier in Training",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_",
//   type: "character",
//   abilities: [rushAbility],
//   flavour: '"I have to do something!"',
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   lore: 1,
//   illustrator: 'Michael "Cookie" Niewiadomy',
//   number: 117,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 518786,
//   },
//   rarity: "common",
// };
//
