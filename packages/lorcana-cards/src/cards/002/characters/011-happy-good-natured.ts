import type { CharacterCard } from "@tcg/lorcana-types";

export const happyGoodnatured: CharacterCard = {
  abilities: [
    {
      id: "det-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 11,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  cost: 5,
  externalIds: {
    ravensburger: "0157bb5c2ecca10239adf522033e57b4905afa65",
  },
  franchise: "Snow White",
  fullName: "Happy - Good-Natured",
  id: "det",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Happy",
  set: "002",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Good-Natured",
  willpower: 5,
};
