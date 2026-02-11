import type { CharacterCard } from "@tcg/lorcana-types";

export const nathanielFlintNotoriousPirate: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1ub-1",
      text: "PREDATORY INSTINCT You can't play this character unless an opposing character was damaged this turn.",
      type: "static",
    },
  ],
  cardNumber: 196,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  cost: 2,
  externalIds: {
    ravensburger: "eefa3140edf0c08825c839aecce68111a0e5f778",
  },
  franchise: "Treasure Planet",
  fullName: "Nathaniel Flint - Notorious Pirate",
  id: "1ub",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Nathaniel Flint",
  set: "008",
  strength: 3,
  text: "PREDATORY INSTINCT You can't play this character unless an opposing character was damaged this turn.",
  version: "Notorious Pirate",
  willpower: 3,
};
