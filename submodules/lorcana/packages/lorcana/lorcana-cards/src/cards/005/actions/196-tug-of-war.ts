import type { ActionCard } from "@tcg/lorcana-types";
import { tugofwarI18n } from "./196-tug-of-war.i18n";

export const tugofwar: ActionCard = {
  id: "J1D",
  canonicalId: "ci_J1D",
  reprints: ["set5-196"],
  cardType: "action",
  name: "Tug-of-War",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "005",
  cardNumber: 196,
  rarity: "rare",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_3a34c665afa94105b0b19383925dd830",
    tcgPlayer: 557731,
  },
  text: [
    {
      title: "Choose one:",
    },
    {
      title: "• Deal 1 damage to each opposing character without Evasive.",
    },
    {
      title: "• Deal 3 damage to each opposing character with Evasive.",
    },
  ],
  abilities: [
    {
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "deal-damage",
            amount: 1,
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "not",
                  filter: {
                    type: "has-keyword",
                    keyword: "Evasive",
                  },
                },
              ],
            },
          },
          {
            type: "deal-damage",
            amount: 3,
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
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
  i18n: tugofwarI18n,
};
