import type { CharacterCard } from "@tcg/lorcana-types";

export const arielSingingMermaid: CharacterCard = {
  abilities: [
    {
      id: "17w-1",
      keyword: "Singer",
      text: "Singer 7",
      type: "keyword",
      value: 7,
    },
  ],
  cardNumber: 15,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "9e45cd57bcaee1034e81d1c387fdbd8b35cdab85",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel - Singing Mermaid",
  id: "17w",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Ariel",
  set: "009",
  strength: 3,
  text: "Singer 7 (This character counts as cost 7 to sing songs.)",
  version: "Singing Mermaid",
  willpower: 3,
};
