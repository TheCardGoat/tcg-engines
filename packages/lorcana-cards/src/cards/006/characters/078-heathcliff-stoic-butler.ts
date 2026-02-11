import type { CharacterCard } from "@tcg/lorcana-types";

export const heathcliffStoicButler: CharacterCard = {
  abilities: [
    {
      id: "fob-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
  cardNumber: 78,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "387e97baeef07c3cc3b5128b8604c359f50b3818",
  },
  franchise: "Big Hero 6",
  fullName: "Heathcliff - Stoic Butler",
  id: "fob",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Heathcliff",
  set: "006",
  strength: 3,
  text: "Ward (Opponents can't choose this character except to challenge.)",
  version: "Stoic Butler",
  willpower: 3,
};
