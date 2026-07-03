import type { ActionCard } from "@tcg/lorcana-types";
import { threeArrowsEpicI18n } from "./222-three-arrows-epic.i18n";

export const threeArrowsEpic: ActionCard = {
  id: "6sl",
  canonicalId: "ci_cnl",
  slug: "lorcana-ci_cnl",
  printings: [
    {
      id: "set12-222-epic",
      artId: "ci_cnl-epic",
      setCode: "set12",
      collectorNumber: "222",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-197"],
  cardType: "action",
  name: "Three Arrows",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 222,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_8bc3e60c6a77434ca8ba598742c86362",
    tcgPlayer: "690215",
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
  i18n: threeArrowsEpicI18n,
};
