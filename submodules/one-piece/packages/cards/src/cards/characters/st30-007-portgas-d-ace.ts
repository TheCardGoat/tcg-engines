import type { CharacterCard } from "@tcg/op-types";
import { st30PortgasDAce007I18n } from "./st30-007-portgas-d-ace.i18n.ts";
export const st30PortgasDAce007: CharacterCard = {
  id: "ST30-007",
  canonicalId: "ST30-007",
  slug: "portgas-d-ace/st30-007",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "ST30-007",
      artId: "ST30-007",
      setCode: "ST30",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-007.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST30",
  cost: 4,
  traits: ["Whitebeard Pirates"],
  power: 6000,
  attribute: "special",
  effect:
    "[On Play] You may rest 1 of your DON!! cards: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.) [When Attacking] Give up to 1 of your opponent's Characters −1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 1,
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
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "whenAttacking",
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
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st30PortgasDAce007I18n,
};
