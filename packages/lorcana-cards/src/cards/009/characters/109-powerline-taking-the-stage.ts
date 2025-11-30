import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "109",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "eaec5385aacc0b81f5f7c60bb16fc754ed2fce81",
  },
  keywords: [
    {
      type: "Singer",
      value: 4,
    },
  ],
  abilities: [
    {
      id: "1t6a1",
      text: "Singer 4",
      type: "keyword",
      keyword: "Singer",
      value: 4,
    },
  ],
  classifications: ["Storyborn"],
};
