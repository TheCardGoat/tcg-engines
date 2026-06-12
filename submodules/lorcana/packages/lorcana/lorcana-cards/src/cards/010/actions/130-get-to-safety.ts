import type { ActionCard } from "@tcg/lorcana-types";
import { getToSafetyI18n } from "./130-get-to-safety.i18n";

export const getToSafety: ActionCard = {
  id: "a5f",
  canonicalId: "ci_a5f",
  reprints: ["set10-130"],
  cardType: "action",
  name: "Get to Safety!",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 130,
  rarity: "rare",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_898936239d774f7199fa2911d1528878",
    tcgPlayer: 660023,
  },
  text: "Play a location with cost 3 or less from your discard for free. Then, if you have a location named Sleepy Hollow in play, draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            cost: "free",
            filter: {
              cardType: "location",
              maxCost: 3,
            },
            from: "discard",
            type: "play-card",
          },
          {
            condition: {
              type: "target-query",
              query: {
                selector: "all",
                owner: "you",
                zones: ["play"],
                cardType: "location",
                filters: [
                  {
                    type: "name",
                    contains: "Sleepy Hollow",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: getToSafetyI18n,
};
