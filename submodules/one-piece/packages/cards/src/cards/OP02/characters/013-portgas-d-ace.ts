import type { CharacterCard } from "@tcg/op-types";
import { op02PortgasDAce013I18n } from "./013-portgas-d-ace.i18n.ts";

export const op02PortgasDAce013: CharacterCard = {
  id: "OP02-013",
  canonicalId: "OP02-013",
  slug: "portgas-d-ace/op02-013",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP02-013",
      artId: "OP02-013",
      setCode: "OP02",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-013.jpg",
    },
    {
      id: "OP02-013_p1",
      artId: "OP02-013_p1",
      setCode: "OP02",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-013_p1.jpg",
    },
    {
      id: "OP02-013_p2",
      artId: "OP02-013_p2",
      setCode: "OP02",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-013_p2.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP02",
  cost: 7,
  power: 7000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-013_p1.jpg",
      imageId: "OP02-013_p1",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-013_p2.jpg",
      imageId: "OP02-013_p2",
    },
  ],
  effect:
    "[On Play] Give up to 2 of your opponent's Characters -3000 power during this turn. Then, if your Leader's type includes \"Whitebeard Pirates\", this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
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
            duration: "thisTurn",
            condition: {
              condition: "leaderTrait",
              trait: "Whitebeard Pirates",
              match: "includes",
            },
          },
        ],
      },
    ],
  },
  i18n: op02PortgasDAce013I18n,
};
