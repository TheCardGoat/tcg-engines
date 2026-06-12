import type { ActionCard } from "@tcg/lorcana-types";
import { twinFireI18n } from "./197-twin-fire.i18n";

export const twinFire: ActionCard = {
  id: "Vmz",
  canonicalId: "ci_Vmz",
  reprints: ["set6-197"],
  cardType: "action",
  name: "Twin Fire",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 197,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_7f56bbeab3ce4593beb4feea23724b82",
    tcgPlayer: 591992,
  },
  text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "deal-damage",
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
                  amount: 2,
                  target: {
                    selector: "chosen",
                    count: 1,
                    owner: "any",
                    zones: ["play"],
                    cardTypes: ["character"],
                    requireDifferentTargets: true,
                  },
                  type: "deal-damage",
                },
              ],
            },
            type: "optional",
          },
        ],
      },
      id: "w3l-1",
      text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
      type: "action",
    },
  ],
  i18n: twinFireI18n,
};
