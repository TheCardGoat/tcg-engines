import type { CharacterCard } from "@tcg/lorcana-types";

export const teKaTheBurningOne: CharacterCard = {
  id: "cs8",
  cardType: "character",
  name: "Te Ka",
  version: "The Burning One",
  fullName: "Te Ka - The Burning One",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**Reckless** _(This character can",
  cost: 6,
  strength: 8,
  willpower: 6,
  lore: 0,
  cardNumber: 126,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const teKaTheBurningOne: LorcanitoCharacterCard = {
//   id: "cs8",
//   name: "Te Ka",
//   title: "The Burning One",
//   characteristics: ["storyborn", "villain", "deity"],
//   text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
//   type: "character",
//   abilities: [recklessAbility],
//   flavour: "She burns for that which was stolen from her.",
//   colors: ["ruby"],
//   cost: 6,
//   strength: 8,
//   willpower: 6,
//   lore: 0,
//   illustrator: "Kamil Murzyn",
//   number: 126,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508803,
//   },
//   rarity: "super_rare",
// };
//
