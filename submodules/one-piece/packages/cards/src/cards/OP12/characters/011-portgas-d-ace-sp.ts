import type { CharacterCard } from "@tcg/op-types";
import { op12PortgasDAceSp011I18n } from "./011-portgas-d-ace-sp.i18n.ts";

export const op12PortgasDAceSp011: CharacterCard = {
  id: "ST13-011",
  canonicalId: "ST13-011",
  slug: "portgas-d-ace-sp/st13-011",
  name: "Portgas.D.Ace (SP)",
  alternateNames: ["Portgas.D.Ace"],
  printings: [
    {
      id: "ST13-011",
      artId: "ST13-011",
      setCode: "OP12",
      collectorNumber: "011",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST13-011_p2.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP12",
  cost: 5,
  power: 7000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[On Play] If you have 2 or less Life cards, this Character gains [Rush].(This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op12PortgasDAceSp011I18n,
};
