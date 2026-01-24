import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonDespicableDealer: CharacterCard = {
  id: "9k7",
  cardType: "character",
  name: "Gaston",
  version: "Despicable Dealer",
  fullName: "Gaston - Despicable Dealer",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "DUBIOUS RECRUITMENT {E} — You pay 2 {I} less for the next character you play this turn.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 10,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "227600aa724c645ab4db45734ad272f904d89fe5",
  },
  abilities: [
    {
      id: "9k7-1",
      type: "activated",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "DUBIOUS RECRUITMENT {E} — You pay 2 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
