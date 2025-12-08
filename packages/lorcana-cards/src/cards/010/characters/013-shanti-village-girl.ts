import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "013",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "4f296f41288f0bc56b098b2146d98af6428db935",
  },
  keywords: [
    {
      type: "Singer",
      value: 5,
    },
  ],
  abilities: [
    {
      id: "lyq-1",
      text: "Singer 5",
      type: "keyword",
      keyword: "Singer",
      value: 5,
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
