import type { ActionCard } from "@tcg/lorcana-types";
import { downInNewOrleansI18n } from "./177-down-in-new-orleans.i18n";

export const downInNewOrleans: ActionCard = {
  id: "AvD",
  canonicalId: "ci_AvD",
  slug: "lorcana-ci_AvD",
  printings: [
    {
      id: "set8-177",
      artId: "set8-177",
      setCode: "set8",
      collectorNumber: "177",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set8-177"],
  cardType: "action",
  name: "Down in New Orleans",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "008",
  cardNumber: 177,
  rarity: "common",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_3334bebad6e7424c80c2b8c0e157f654",
  },
  text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 3,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "play",
            max: 1,
            reveal: true,
            cost: "free",
            filters: [
              {
                type: "and",
                filters: [
                  {
                    type: "or",
                    filters: [
                      {
                        type: "card-type",
                        cardType: "character",
                      },
                      {
                        type: "card-type",
                        cardType: "item",
                      },
                      {
                        type: "card-type",
                        cardType: "location",
                      },
                    ],
                  },
                  {
                    type: "cost-comparison",
                    comparison: "less-or-equal",
                    value: 6,
                  },
                ],
              },
            ],
          },
          {
            zone: "deck-bottom",
            ordering: "player-choice",
            remainder: true,
          },
        ],
      },
      id: "nqg-1",
      text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  i18n: downInNewOrleansI18n,
};
