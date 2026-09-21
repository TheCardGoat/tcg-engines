import type { CharacterCard } from "@tcg/op-types";
import { op17PortgasDAce013I18n } from "./op17-013-portgas-d-ace.i18n.ts";

export const op17PortgasDAce013: CharacterCard = {
  id: "OP17-013",
  canonicalId: "OP17-013",
  slug: "portgas-d-ace/op17-013",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP17-013",
      artId: "OP17-013",
      setCode: "OP17",
      collectorNumber: "013",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-013.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP17",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "If your opponent has a Character with 10000 power or more, give this card in your hand -2 cost. [On Play] If your Leader is [Edward.Newgate], give up to 1 of your opponent's rested Characters -6000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Edward.Newgate",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
            value: -6000,
            duration: "thisTurn",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 10000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: -2,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17PortgasDAce013I18n,
};
