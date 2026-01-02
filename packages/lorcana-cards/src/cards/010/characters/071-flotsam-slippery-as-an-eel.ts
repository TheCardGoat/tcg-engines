import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamSlipperyAsAnEel: CharacterCard = {
  id: "3ma",
  cardType: "character",
  name: "Flotsam",
  version: "Slippery as an Eel",
  fullName: "Flotsam - Slippery as an Eel",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 71,
  inkable: true,
  externalIds: {
    ravensburger: "0d0b8280324df86a9fb785909a5ba25e5422f783",
  },
  abilities: [
    {
      id: "3ma-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
