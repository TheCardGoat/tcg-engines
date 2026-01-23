import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonArrogantHunter: CharacterCard = {
  id: "j7q",
  cardType: "character",
  name: "Gaston",
  version: "Arrogant Hunter",
  fullName: "Gaston - Arrogant Hunter",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**Reckless** _(This character can",
  cost: 2,
  strength: 4,
  willpower: 2,
  lore: 0,
  cardNumber: 110,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const gastonArrogantHunter: LorcanitoCharacterCard = {
//   id: "j7q",
//   reprints: ["k2n"],
//
//   name: "Gaston",
//   title: "Arrogant Hunter",
//   characteristics: ["storyborn", "villain"],
//   text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
//   type: "character",
//   abilities: [recklessAbility],
//   flavour: "It's not arrogance when you really <b>are</b> the best.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 4,
//   willpower: 2,
//   lore: 0,
//   illustrator: "Matthew Robert Davies",
//   number: 110,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 504453,
//   },
//   rarity: "common",
// };
//
