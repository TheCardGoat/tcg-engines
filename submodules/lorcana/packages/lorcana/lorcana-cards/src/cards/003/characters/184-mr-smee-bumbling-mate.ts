import type { CharacterCard } from "@tcg/lorcana-types";
import { mrSmeeBumblingMateI18n } from "./184-mr-smee-bumbling-mate.i18n";

export const mrSmeeBumblingMate: CharacterCard = {
  id: "7M2",
  canonicalId: "ci_7M2",
  reprints: ["set3-184"],
  cardType: "character",
  name: "Mr. Smee",
  version: "Bumbling Mate",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 184,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c608166f5ffb4bb195af64fb501902cb",
    tcgPlayer: 539111,
  },
  text: [
    {
      title: "OH DEAR, DEAR, DEAR",
      description:
        "At the end of your turn, if this character is exerted and you don't have a Captain character in play, deal 1 damage to this character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
  abilities: [
    {
      condition: {
        type: "and",
        conditions: [
          {
            type: "target-query",
            query: {
              selector: "all",
              reference: "source",
              filters: [
                {
                  type: "exerted",
                },
              ],
            },
            comparison: {
              operator: "gte",
              value: 1,
            },
          },
          {
            type: "not",
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
                    classification: "Captain",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
          },
        ],
      },
      effect: {
        amount: 1,
        target: "SELF",
        type: "deal-damage",
      },
      id: "16t-1",
      name: "OH DEAR, DEAR, DEAR",
      text: "OH DEAR, DEAR, DEAR At the end of your turn, if this character is exerted and you don't have a Captain character in play, deal 1 damage to this character.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: mrSmeeBumblingMateI18n,
};
