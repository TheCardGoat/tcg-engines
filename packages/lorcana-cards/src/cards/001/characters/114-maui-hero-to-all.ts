import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiHeroToAll: CharacterCard = {
  abilities: [
    {
      id: "1s6-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      id: "1s6-2",
      keyword: "Reckless",
      text: "Reckless",
      type: "keyword",
    },
  ],
  cardNumber: 114,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity"],
  cost: 5,
  externalIds: {
    ravensburger: "e7461b5e5c9e2bd3760cbfd6a8b7995386f18c2e",
  },
  franchise: "Moana",
  fullName: "Maui - Hero to All",
  id: "1s6",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  name: "Maui",
  set: "001",
  strength: 6,
  text: "Rush (This character can challenge the turn they're played.)\nReckless (This character can't quest and must challenge each turn if able.)",
  version: "Hero to All",
  willpower: 5,
};
