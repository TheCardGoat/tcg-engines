import type { CharacterCard } from "@tcg/lorcana";

export const rajahGhostlyTiger: CharacterCard = {
  id: "1ba",
  cardType: "character",
  name: "Rajah",
  version: "Ghostly Tiger",
  fullName: "Rajah - Ghostly Tiger",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  text: "Vanish (When an opponent chooses this character for an action, banish them.)",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 62,
  inkable: true,
  externalIds: {
    ravensburger: "aa7759237b508c4b2e253ca43417ab8d26d6da36",
  },
  keywords: ["Vanish"],
  abilities: [
    {
      id: "1ba-1",
      text: "Vanish",
      type: "keyword",
      keyword: "Vanish",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};
