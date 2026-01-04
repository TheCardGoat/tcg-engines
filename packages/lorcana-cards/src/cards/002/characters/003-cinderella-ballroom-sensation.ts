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
      text: "Singer +3",
      type: "keyword",
      keyword: "Singer",
      value: 3,
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
