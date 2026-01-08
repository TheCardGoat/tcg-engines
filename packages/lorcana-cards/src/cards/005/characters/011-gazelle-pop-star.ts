import type { CharacterCard } from "@tcg/lorcana-types";

export const gazellePopStar: CharacterCard = {
  id: "g80",
  cardType: "character",
  name: "Gazelle",
  version: "Pop Star",
  fullName: "Gazelle - Pop Star",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "005",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 11,
  inkable: true,
  externalIds: {
    ravensburger: "3a77973047a9e2dc5748299006ede3868e00d061",
  },
  abilities: [
    {
      id: "g80-1",
      type: "keyword",
      keyword: "Singer",
      value: 5,
      text: "Singer 5",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const gazellePopStar: LorcanitoCharacterCard = {
//   id: "y3o",
//   name: "Gazelle",
//   title: "Pop Star",
//   characteristics: ["storyborn", "ally"],
//   text: "**Singer 5** _(This character counts as cost 5 to sing songs.)_",
//   type: "character",
//   abilities: [singerAbility(5)],
//   flavour:
//     "Good evening, Lorcana! We are here tonight to celebrate the possibilities that open up when we unite.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Lauren Barger",
//   number: 11,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561947,
//   },
//   rarity: "common",
// };
//
