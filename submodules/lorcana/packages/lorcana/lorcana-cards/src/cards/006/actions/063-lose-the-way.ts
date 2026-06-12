import type { ActionCard } from "@tcg/lorcana-types";
import { loseTheWayI18n } from "./063-lose-the-way.i18n";

export const loseTheWay: ActionCard = {
  id: "Aft",
  canonicalId: "ci_Aft",
  reprints: ["set6-063"],
  cardType: "action",
  name: "Lose the Way",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 63,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d7336a7cef10416793a025c24ffc28a0",
    tcgPlayer: 587754,
  },
  text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "exert",
          },
          {
            chooser: "CONTROLLER",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "discard",
                  amount: 1,
                  from: "hand",
                  target: "CONTROLLER",
                  chosen: true,
                },
                {
                  duration: "until-start-of-next-turn",
                  restriction: "cant-ready",
                  target: {
                    ref: "previous-target",
                  },
                  type: "restriction",
                },
              ],
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      id: "1um-1",
      text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
      type: "action",
    },
  ],
  i18n: loseTheWayI18n,
};
