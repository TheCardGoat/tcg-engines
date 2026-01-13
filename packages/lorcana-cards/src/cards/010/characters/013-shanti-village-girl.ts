import type { CharacterCard } from "@tcg/lorcana-types";

export const shantiVillageGirl: CharacterCard = {
  id: "lyq",
  cardType: "character",
  name: "Shanti",
  version: "Village Girl",
  fullName: "Shanti - Village Girl",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 2,
  cardNumber: 13,
  inkable: true,
  externalIds: {
    ravensburger: "4f296f41288f0bc56b098b2146d98af6428db935",
  },
  abilities: [
    {
      id: "lyq-1",
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
// export const shantiVillageGirl: LorcanitoCharacterCard = {
//   id: "i86",
//   name: "Shanti",
//   title: "Village Girl",
//   characteristics: ["storyborn", "ally"],
//   text: "Singer 5 (This character counts as cost 5 to sing songs.)",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 0,
//   willpower: 5,
//   illustrator: "Casey Robin",
//   number: 13,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659179,
//   },
//   rarity: "common",
//   abilities: [singerAbility(5)],
//   lore: 2,
// };
//
