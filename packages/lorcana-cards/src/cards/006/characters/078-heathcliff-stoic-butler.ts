import type { CharacterCard } from "@tcg/lorcana-types";

export const heathcliffStoicButler: CharacterCard = {
  id: "fob",
  cardType: "character",
  name: "Heathcliff",
  version: "Stoic Butler",
  fullName: "Heathcliff - Stoic Butler",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 78,
  inkable: true,
  externalIds: {
    ravensburger: "387e97baeef07c3cc3b5128b8604c359f50b3818",
  },
  abilities: [
    {
      id: "fob-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
