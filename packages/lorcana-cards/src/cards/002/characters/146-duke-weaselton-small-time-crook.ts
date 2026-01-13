import type { CharacterCard } from "@tcg/lorcana-types";

export const dukeWeaseltonSmalltimeCrook: CharacterCard = {
  id: "1e8",
  cardType: "character",
  name: "Duke Weaselton",
  version: "Small-Time Crook",
  fullName: "Duke Weaselton - Small-Time Crook",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 146,
  inkable: true,
  externalIds: {
    ravensburger: "b51612597f56a105b1d978244f4cde86b568d13e",
  },
  abilities: [
    {
      id: "1e8-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const dukeWeaseltonSmallTimeCrook: LorcanitoCharacterCard = {
//   id: "b5u",
//
//   name: "Duke Weaselton",
//   title: "Small-Time Crook",
//   characteristics: ["storyborn"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_",
//   type: "character",
//   abilities: [wardAbility],
//   flavour: "It's Wee-sel-ton.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Rosa la Barbera / Leonardo Giammichele",
//   number: 146,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527763,
//   },
//   rarity: "common",
// };
//
