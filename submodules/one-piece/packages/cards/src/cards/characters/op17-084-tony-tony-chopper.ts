import type { CharacterCard } from "@tcg/op-types";
import { op17TonyTonyChopper084I18n } from "./op17-084-tony-tony-chopper.i18n.ts";

export const op17TonyTonyChopper084: CharacterCard = {
  id: "OP17-084",
  canonicalId: "OP17-084",
  slug: "tony-tony-chopper/op17-084",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP17-084",
      artId: "OP17-084",
      setCode: "OP17",
      collectorNumber: "084",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-084_JM5DAVg.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP17",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Animal Straw Hat Crew Elbaph"],
  attribute: "strike",
  effect:
    "[On Play] If there is a Character with a cost of 12 or more, up to 1 of your Characters gains [Unblockable] during this turn.\n(This card cannot be blocked.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op17TonyTonyChopper084I18n,
};
