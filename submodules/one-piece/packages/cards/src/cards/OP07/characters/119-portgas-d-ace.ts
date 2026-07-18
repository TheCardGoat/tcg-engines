import type { CharacterCard } from "@tcg/op-types";
import { op07PortgasDAce119I18n } from "./119-portgas-d-ace.i18n.ts";

export const op07PortgasDAce119: CharacterCard = {
  id: "OP07-119",
  canonicalId: "OP07-119",
  slug: "portgas-d-ace/op07-119",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP07-119",
      artId: "OP07-119",
      setCode: "OP07",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-119.jpg",
    },
    {
      id: "OP07-119_p1",
      artId: "OP07-119_p1",
      setCode: "OP07",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-119_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "OP07",
  cost: 10,
  power: 10000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-119_p1.jpg",
      imageId: "OP07-119_p1",
    },
  ],
  effect:
    "[On Play] Add up to 1 card from the top of your deck to the top of your Life cards. Then, if you have 2 or less Life cards, this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          },
        ],
      },
    ],
  },
  i18n: op07PortgasDAce119I18n,
};
