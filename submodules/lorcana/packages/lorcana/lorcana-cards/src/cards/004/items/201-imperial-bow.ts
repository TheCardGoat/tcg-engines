import type { ItemCard } from "@tcg/lorcana-types";
import { imperialBowI18n } from "./201-imperial-bow.i18n";

export const imperialBow: ItemCard = {
  id: "qox",
  canonicalId: "ci_qox",
  reprints: ["set4-201"],
  cardType: "item",
  name: "Imperial Bow",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 201,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c7979a7d0305443eb9ddb9b10469644d",
    tcgPlayer: 549617,
  },
  text: [
    {
      title: "WITHIN RANGE",
      description:
        "{E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn. (They get +2 {S} while challenging. They can challenge characters with Evasive.)",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            duration: "this-turn",
            keyword: "Challenger",
            value: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-classification",
                  classification: "Hero",
                },
              ],
            },
          },
          {
            type: "gain-keyword",
            duration: "this-turn",
            keyword: "Evasive",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
      id: "1li-1",
      name: "WITHIN RANGE",
      text: "WITHIN RANGE {E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn.",
      type: "activated",
    },
  ],
  i18n: imperialBowI18n,
};
