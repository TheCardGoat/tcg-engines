import type { ActionCard } from "@tcg/lorcana-types";
import { timeToGoI18n } from "./131-time-to-go.i18n";

export const timeToGo: ActionCard = {
  id: "W3D",
  canonicalId: "ci_W3D",
  reprints: ["set10-131"],
  cardType: "action",
  name: "Time to Go!",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "010",
  cardNumber: 131,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_a34fbc1360b340faa269ab2347af7ee1",
    tcgPlayer: 660003,
  },
  text: "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            reference: "selected-first",
            filters: [
              {
                type: "cards-under",
                comparison: "gte",
                value: 1,
              },
            ],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "draw",
              amount: 3,
              target: "CONTROLLER",
            },
          ],
        },
        else: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "draw",
              amount: 2,
              target: "CONTROLLER",
            },
          ],
        },
      },
    },
  ],
  i18n: timeToGoI18n,
};
