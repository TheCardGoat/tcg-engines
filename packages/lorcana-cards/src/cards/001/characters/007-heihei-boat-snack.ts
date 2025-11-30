import type { CharacterCard } from "@tcg/lorcana";

export const heiheiBoatSnack: CharacterCard = {
  id: "uio",
  cardType: "character",
  name: "HeiHei",
  version: "Boat Snack",
  fullName: "HeiHei - Boat Snack",
  inkType: ["amber"],
  franchise: "Moana",
  set: "001",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "007",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "6dfdbf904cb6a8f2f700f9839e50902b7dd4bcad",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "uioa1",
      text: "Support",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
