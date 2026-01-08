import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaBallroomSensation: CharacterCard = {
  id: "4j3",
  cardType: "character",
  name: "Cinderella",
  version: "Ballroom Sensation",
  fullName: "Cinderella - Ballroom Sensation",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "002",
  text: "Singer 3 (This character counts as cost 3 to sing songs.)",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 3,
  inkable: true,
  externalIds: {
    ravensburger: "1053acb0af19beb3e33f5d547aa4078efbd13b6c",
  },
  abilities: [
    {
      id: "4j3-1",
      type: "keyword",
      keyword: "Singer",
      value: 3,
      text: "Singer 3",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const cinderellaBallroomSensation: LorcanitoCharacterCard = {
//   id: "rgn",
//   name: "Cinderella",
//   title: "Ballroom Sensation",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**Singer** 3 _(This character counts as cost 3 to sing songs.)_",
//   type: "character",
//   abilities: [singerAbility(3)],
//   flavour:
//     "With a magical dress and a song in her heart, she dazzled everyone at the ball.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Casey Robin",
//   number: 3,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527179,
//   },
//   rarity: "rare",
// };
//
