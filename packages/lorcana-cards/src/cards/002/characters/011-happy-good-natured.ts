import type { CharacterCard } from "@tcg/lorcana";

export const happyGoodnatured: CharacterCard = {
  id: "det",
  cardType: "character",
  name: "Happy",
  version: "Good-Natured",
  fullName: "Happy - Good-Natured",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 11,
  inkable: true,
  externalIds: {
    ravensburger: "0157bb5c2ecca10239adf522033e57b4905afa65",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "det-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};
