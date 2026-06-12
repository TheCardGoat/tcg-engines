import type { CharacterCard } from "@tcg/lorcana-types";
import { rajahRoyalProtectorI18n } from "./192-rajah-royal-protector.i18n";

export const rajahRoyalProtector: CharacterCard = {
  id: "SUh",
  canonicalId: "ci_SUh",
  reprints: ["set4-192"],
  cardType: "character",
  name: "Rajah",
  version: "Royal Protector",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "004",
  cardNumber: 192,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dbc5f2c9f1cc41ebb7b6ba6c9133a942",
    tcgPlayer: 547779,
  },
  text: [
    {
      title: "STEADY GAZE",
      description:
        "While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
        challengerFilter: {
          type: "cost-comparison",
          operator: "lte",
          value: 4,
        },
      },
      id: "f6t-1",
      name: "STEADY GAZE",
      text: "STEADY GAZE While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
      type: "static",
    },
  ],
  i18n: rajahRoyalProtectorI18n,
};
