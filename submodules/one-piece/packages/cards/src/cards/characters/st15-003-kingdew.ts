import type { CharacterCard } from "@tcg/op-types";
import { st15Kingdew003I18n } from "./st15-003-kingdew.i18n.ts";
export const st15Kingdew003: CharacterCard = {
  id: "ST15-003",
  canonicalId: "ST15-003",
  slug: "kingdew/st15-003",
  name: "Kingdew",
  printings: [
    {
      id: "ST15-003",
      artId: "ST15-003",
      setCode: "ST15",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST15-003.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST15",
  cost: 3,
  traits: ["Whitebeard Pirates"],
  power: 4000,
  attribute: "strike",
  counter: 1000,
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Opponent's Turn] When this Character is K.O.'d by an effect, up to 1 of your Leader gains +2000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        eventFilter: { koCause: "effect" },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st15Kingdew003I18n,
};
