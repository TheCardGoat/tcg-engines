import type { CharacterCard } from "@tcg/lorcana-types";

export const powerlineTakingTheStage: CharacterCard = {
  id: "1t6",
  cardType: "character",
  name: "Powerline",
  version: "Taking the Stage",
  fullName: "Powerline - Taking the Stage",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Singer 4 (This character counts as cost 4 to sing songs.)",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 109,
  inkable: true,
  externalIds: {
    ravensburger: "eaec5385aacc0b81f5f7c60bb16fc754ed2fce81",
  },
  abilities: [
    {
      id: "1t6-1",
      type: "keyword",
      keyword: "Singer",
      value: 4,
      text: "Singer 4",
    },
  ],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const powerlineTakingTheStage: LorcanitoCharacterCard = {
//   id: "mpw",
//   name: "Powerline",
//   title: "Taking the Stage",
//   characteristics: ["storyborn"],
//   text: "Singer 4 (This character counts as cost 4 to sing songs.)",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Stefano Spagnuolo",
//   number: 109,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647682,
//   },
//   rarity: "common",
//   abilities: [singerAbility(4)],
//   lore: 1,
// };
//
