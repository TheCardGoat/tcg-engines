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
  cardNumber: "062",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "aa7759237b508c4b2e253ca43417ab8d26d6da36",
  },
  keywords: ["Vanish"],
  abilities: [
    {
      id: "1ba-ability-1",
      text: "Vanish (When an opponent chooses this character for an action, banish them.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};
