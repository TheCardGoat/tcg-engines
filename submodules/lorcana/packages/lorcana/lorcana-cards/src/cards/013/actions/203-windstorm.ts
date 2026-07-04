import type { ActionCard } from "@tcg/lorcana-types";
import { windstormI18n } from "./203-windstorm.i18n";

export const windstorm: ActionCard = {
  id: "WkJ",
  canonicalId: "ci_WkJ",
  slug: "lorcana-ci_WkJ",
  printings: [
    {
      id: "set13-203",
      artId: "set13-203",
      setCode: "set13",
      collectorNumber: "203",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-203"],
  cardType: "action",
  name: "Windstorm",
  inkType: ["steel"],
  franchise: "Up",
  set: "013",
  cardNumber: 203,
  rarity: "rare",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_d64d3fddaf584da990cbcf6a1f9a5ff7",
  },
  text: "Deal 1 damage to each opposing character and location. Then, deal 2 damage to each opposing character with Evasive and each opposing location with Evasive.",
  abilities: [
    {
      type: "action",
      text: "Deal 1 damage to each opposing character and location. Then, deal 2 damage to each opposing character with Evasive and each opposing location with Evasive.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 1,
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character", "location"],
            },
          },
          {
            type: "deal-damage",
            amount: 2,
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character", "location"],
              filter: [
                {
                  type: "has-keyword",
                  keyword: "Evasive",
                },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: windstormI18n,
};
