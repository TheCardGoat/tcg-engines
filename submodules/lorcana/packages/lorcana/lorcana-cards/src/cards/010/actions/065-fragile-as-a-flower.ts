import type { ActionCard } from "@tcg/lorcana-types";
import { fragileAsAFlowerI18n } from "./065-fragile-as-a-flower.i18n";

export const fragileAsAFlower: ActionCard = {
  id: "Bll",
  canonicalId: "ci_Bll",
  reprints: ["set10-065"],
  cardType: "action",
  name: "Fragile as a Flower",
  inkType: ["amethyst"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 65,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_84584c67578c4843a7aa845642566259",
    tcgPlayer: 659418,
  },
  text: "Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "cost-comparison",
                  comparison: "less-or-equal",
                  value: 2,
                },
              ],
            },
            type: "exert",
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
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: fragileAsAFlowerI18n,
};
