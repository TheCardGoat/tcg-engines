import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuInHerElement: CharacterCard = {
  id: "39b",
  cardType: "character",
  name: "Sisu",
  version: "In Her Element",
  fullName: "Sisu - In Her Element",
  inkType: ["amethyst"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 39,
  inkable: true,
  externalIds: {
    ravensburger: "0bbeceed403764a29bc21ac53a1d7095e9c56321",
  },
  abilities: [
    {
      id: "39b-1",
      text: "Challenger +2",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};
