import type { CharacterCard } from "@tcg/op-types";
import { op12Patty074I18n } from "./074-patty.i18n.ts";

export const op12Patty074: CharacterCard = {
  id: "OP12-074",
  canonicalId: "OP12-074",
  slug: "patty/op12-074",
  name: "Patty",
  printings: [
    {
      id: "OP12-074",
      artId: "OP12-074",
      setCode: "OP12",
      collectorNumber: "074",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-074_TB68VdF.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 2000,
  counter: 2000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 Event from your hand: If your Leader is [Sanji], add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
            condition: {
              condition: "leaderName",
              name: "Sanji",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Patty074I18n,
};
