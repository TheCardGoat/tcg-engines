import type { CharacterCard } from "@tcg/op-types";
import { pGolDRoger107I18n } from "./p-107-gol-d-roger.i18n.ts";

export const pGolDRoger107: CharacterCard = {
  id: "P-107",
  canonicalId: "P-107",
  slug: "gol-d-roger/p-107",
  name: "Gol.D.Roger",
  printings: [
    {
      id: "P-107",
      artId: "P-107_p1",
      setCode: "P",
      collectorNumber: "107",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-107_p1.jpg",
      label: "Gol.D.Roger (P-107) (SP)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 8,
  power: 10000,
  traits: ["Roger Pirates King of the Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If either you or your opponent has 10 DON!! cards on the field, your Leader gains +2000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "gte",
                value: 10,
              },
              {
                condition: "donFieldCount",
                player: "opponent",
                comparison: "gte",
                value: 10,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: { amount: 1 },
            },
            value: 2000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: pGolDRoger107I18n,
};
