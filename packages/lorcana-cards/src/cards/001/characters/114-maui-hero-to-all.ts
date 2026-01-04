import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiHeroToAll: CharacterCard = {
  id: "1s6",
  cardType: "character",
  name: "Maui",
  version: "Hero to All",
  fullName: "Maui - Hero to All",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)\nReckless (This character can't quest and must challenge each turn if able.)",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 0,
  cardNumber: 114,
  inkable: true,
  externalIds: {
    ravensburger: "e7461b5e5c9e2bd3760cbfd6a8b7995386f18c2e",
  },
  abilities: [
    {
      id: "1s6-1",
      type: "keyword",
      keyword: "Rush",
    },
    {
      id: "1s6-2",
      type: "keyword",
      keyword: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
};
