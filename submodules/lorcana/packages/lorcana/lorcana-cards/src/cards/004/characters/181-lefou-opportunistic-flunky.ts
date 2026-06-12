import type { CharacterCard } from "@tcg/lorcana-types";
import { lefouOpportunisticFlunkyI18n } from "./181-lefou-opportunistic-flunky.i18n";

export const lefouOpportunisticFlunky: CharacterCard = {
  id: "ggW",
  canonicalId: "ci_ggW",
  reprints: ["set4-181"],
  cardType: "character",
  name: "LeFou",
  version: "Opportunistic Flunky",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 181,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_91f835d4527741b8b1190e6695d55698",
    tcgPlayer: 549559,
  },
  text: [
    {
      title: "I LEARNED FROM THE BEST",
      description:
        "During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "and",
        conditions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "banished-in-challenge-this-turn",
            owner: "opponent",
          },
        ],
      },
      effect: {
        amount: "full",
        type: "cost-reduction",
      },
      id: "1x0-1",
      name: "I LEARNED FROM THE BEST",
      sourceZones: ["hand"],
      text: "I LEARNED FROM THE BEST During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
      type: "static",
    },
  ],
  i18n: lefouOpportunisticFlunkyI18n,
};
