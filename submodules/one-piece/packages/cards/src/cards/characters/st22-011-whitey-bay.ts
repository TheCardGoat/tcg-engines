import type { CharacterCard } from "@tcg/op-types";
import { st22WhiteyBay011I18n } from "./st22-011-whitey-bay.i18n.ts";
export const st22WhiteyBay011: CharacterCard = {
  id: "ST22-011",
  canonicalId: "ST22-011",
  slug: "whitey-bay/st22-011",
  name: "Whitey Bay",
  printings: [
    {
      id: "ST22-011",
      artId: "ST22-011",
      setCode: "ST22",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-011.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST22",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    '[Your Turn] [On Play] You may reveal 2 cards with a type including "Whitebeard Pirates" from your hand: Up to 1 of your Leader with a type including "Whitebeard Pirates" gains +2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        costs: [
          {
            cost: "revealFromHand",
            amount: 2,
            filters: [
              {
                filter: "trait",
                value: "Whitebeard Pirates",
                match: "includes",
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
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                  match: "includes",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st22WhiteyBay011I18n,
};
