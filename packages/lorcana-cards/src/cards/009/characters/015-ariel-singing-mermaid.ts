import type { CharacterCard } from "@tcg/lorcana-types";

export const arielSingingMermaid: CharacterCard = {
  id: "17w",
  cardType: "character",
  name: "Ariel",
  version: "Singing Mermaid",
  fullName: "Ariel - Singing Mermaid",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Singer 7 (This character counts as cost 7 to sing songs.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  externalIds: {
    ravensburger: "9e45cd57bcaee1034e81d1c387fdbd8b35cdab85",
  },
  abilities: [
    {
      id: "17w-1",
      text: "Singer +7",
      type: "keyword",
      keyword: "Singer",
      value: 7,
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
