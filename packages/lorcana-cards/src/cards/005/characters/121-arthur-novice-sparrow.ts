import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurNoviceSparrow: CharacterCard = {
  id: "bn1",
  cardType: "character",
  name: "Arthur",
  version: "Novice Sparrow",
  fullName: "Arthur - Novice Sparrow",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 0,
  cardNumber: 121,
  inkable: false,
  externalIds: {
    ravensburger: "29f376ad78c551ed84b353cdcbe6ae4a1bceaa40",
  },
  abilities: [
    {
      id: "bn1-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const arthurNoviceSparrow: LorcanitoCharacterCard = {
//   id: "b3l",
//   name: "Arthur",
//   title: "Novice Sparrow",
//   characteristics: ["hero", "storyborn"],
//   text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
//   type: "character",
//   abilities: [recklessAbility],
//   flavour: "Hold it boy. Not so fast.\n−Merlin",
//   colors: ["ruby"],
//   cost: 1,
//   strength: 2,
//   willpower: 3,
//   lore: 0,
//   illustrator: "Brian Weisz",
//   number: 121,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561466,
//   },
//   rarity: "uncommon",
// };
//
