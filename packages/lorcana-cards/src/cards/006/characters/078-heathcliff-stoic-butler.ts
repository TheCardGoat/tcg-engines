import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "078",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "387e97baeef07c3cc3b5128b8604c359f50b3818",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "fob-ability-1",
      text: "Ward (Opponents can't choose this character except to challenge.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
