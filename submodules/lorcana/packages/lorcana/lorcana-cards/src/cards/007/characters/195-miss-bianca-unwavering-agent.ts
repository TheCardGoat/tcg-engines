import type { CharacterCard } from "@tcg/lorcana-types";
import { missBiancaUnwaveringAgentI18n } from "./195-miss-bianca-unwavering-agent.i18n";

export const missBiancaUnwaveringAgent: CharacterCard = {
  id: "Knt",
  canonicalId: "ci_Knt",
  reprints: ["set7-195"],
  cardType: "character",
  name: "Miss Bianca",
  version: "Unwavering Agent",
  inkType: ["steel"],
  franchise: "Rescuers",
  set: "007",
  cardNumber: 195,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_977124ea617d440a9224e0eb1619ded6",
    tcgPlayer: 619520,
  },
  text: [
    {
      title: "HAVE A LITTLE FAITH",
      description:
        "If you have an Ally character in play, you pay 2 {I} less to play this character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      type: "static",
      id: "jeo-1",
      name: "HAVE A LITTLE FAITH",
      text: "HAVE A LITTLE FAITH If you have an Ally character in play, you pay 2 {I} less to play this character.",
      sourceZones: ["hand"],
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "has-classification",
              classification: "Ally",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
      },
    },
  ],
  i18n: missBiancaUnwaveringAgentI18n,
};
