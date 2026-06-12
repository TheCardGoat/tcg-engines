import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonPureParagonI18n } from "./119-gaston-pure-paragon.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const gastonPureParagon: CharacterCard = {
  id: "JSc",
  canonicalId: "ci_JSc",
  reprints: ["set5-119"],
  cardType: "character",
  name: "Gaston",
  version: "Pure Paragon",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "005",
  cardNumber: 119,
  rarity: "rare",
  cost: 9,
  strength: 10,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_63f4432a95d84d9dab23728cf715f31f",
    tcgPlayer: 560542,
  },
  text: [
    {
      title:
        "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.",
    },
    {
      title: "Rush",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      id: "z5u-1",
      name: "A MAN AMONG MEN!",
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "status",
              status: "damaged",
            },
          ],
          multiplier: 2,
        },
        cardType: "character",
      },
      sourceZones: ["hand"],
      text: "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.",
      type: "static",
    },
    rush,
  ],
  i18n: gastonPureParagonI18n,
};
