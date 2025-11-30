import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "015",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "9e45cd57bcaee1034e81d1c387fdbd8b35cdab85",
  },
  keywords: [
    {
      type: "Singer",
      value: 7,
    },
  ],
  abilities: [
    {
      id: "17w-ability-1",
      text: "Singer 7 (This character counts as cost 7 to sing songs.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
