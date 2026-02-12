import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonDespicableDealer: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "9k7-1",
      text: "DUBIOUS RECRUITMENT {E} — You pay 2 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  cardNumber: 10,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "227600aa724c645ab4db45734ad272f904d89fe5",
  },
  franchise: "Beauty and the Beast",
  fullName: "Gaston - Despicable Dealer",
  id: "9k7",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Gaston",
  set: "004",
  strength: 2,
  text: "DUBIOUS RECRUITMENT {E} — You pay 2 {I} less for the next character you play this turn.",
  version: "Despicable Dealer",
  willpower: 4,
};
