import type { ActionCard } from "@tcg/lorcana-types";
import { breakFreeI18n } from "./127-break-free.i18n";

export const breakFree: ActionCard = {
  id: "W2A",
  canonicalId: "ci_W2A",
  reprints: ["set5-127"],
  cardType: "action",
  name: "Break Free",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "005",
  cardNumber: 127,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8f78f01a16b947d8808ca0d350cb5c31",
    tcgPlayer: 559717,
  },
  text: "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn. (They can challenge the turn they're played.)",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "deal-damage",
          },
          {
            steps: [
              {
                type: "gain-keyword",
                keyword: "Rush",
                duration: "this-turn",
                target: {
                  ref: "previous-target",
                },
              },
              {
                type: "modify-stat",
                stat: "strength",
                modifier: 1,
                target: {
                  ref: "previous-target",
                },
                duration: "this-turn",
              },
            ],
            type: "sequence",
          },
        ],
        type: "sequence",
      },
      id: "10c-1",
      text: "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn.",
      type: "action",
    },
  ],
  i18n: breakFreeI18n,
};
