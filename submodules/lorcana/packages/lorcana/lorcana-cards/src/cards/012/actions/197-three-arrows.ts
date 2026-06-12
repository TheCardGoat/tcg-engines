import type { ActionCard } from "@tcg/lorcana-types";
import { threeArrowsI18n } from "./197-three-arrows.i18n";

export const threeArrows: ActionCard = {
  id: "cnl",
  canonicalId: "ci_cnl",
  reprints: ["set12-197"],
  cardType: "action",
  name: "Three Arrows",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 197,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_8bc3e60c6a77434ca8ba598742c86362",
  },
  text: "Deal 2 damage to chosen character. Then, you may deal 1 damage to another chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "deal-damage",
              amount: 1,
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                requireDifferentTargets: true,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: threeArrowsI18n,
};
