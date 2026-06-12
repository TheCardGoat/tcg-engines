import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonDespicableDealerI18n } from "./010-gaston-despicable-dealer.i18n";

export const gastonDespicableDealer: CharacterCard = {
  id: "a3C",
  canonicalId: "ci_a3C",
  reprints: ["set4-010"],
  cardType: "character",
  name: "Gaston",
  version: "Despicable Dealer",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 10,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_17b54146ce0942e29c41fd91356c1940",
    tcgPlayer: 550557,
  },
  text: [
    {
      title: "DUBIOUS RECRUITMENT",
      description: "{E} — You pay 2 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "9k7-1",
      name: "DUBIOUS RECRUITMENT",
      text: "DUBIOUS RECRUITMENT {E} — You pay 2 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  i18n: gastonDespicableDealerI18n,
};
