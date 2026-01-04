import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricDashingAndBrave: CharacterCard = {
  id: "1cu",
  cardType: "character",
  name: "Prince Eric",
  version: "Dashing and Brave",
  fullName: "Prince Eric - Dashing and Brave",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 194,
  inkable: true,
  externalIds: {
    ravensburger: "b003941c689f0757920787101a49607295e99da1",
  },
  abilities: [
    {
      id: "1cu-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      condition: ".",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
