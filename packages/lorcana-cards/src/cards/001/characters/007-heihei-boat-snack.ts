import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiBoatSnack: CharacterCard = {
  abilities: [
    {
      id: "uio-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 7,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "6dfdbf904cb6a8f2f700f9839e50902b7dd4bcad",
  },
  franchise: "Moana",
  fullName: "HeiHei - Boat Snack",
  id: "uio",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "HeiHei",
  set: "001",
  strength: 1,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Boat Snack",
  willpower: 2,
};
