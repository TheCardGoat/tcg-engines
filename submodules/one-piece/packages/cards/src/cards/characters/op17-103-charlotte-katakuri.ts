import type { CharacterCard } from "@tcg/op-types";
import { op17CharlotteKatakuri103I18n } from "./op17-103-charlotte-katakuri.i18n.ts";

export const op17CharlotteKatakuri103: CharacterCard = {
  id: "OP17-103",
  canonicalId: "OP17-103",
  slug: "charlotte-katakuri/op17-103",
  name: "Charlotte Katakuri",
  printings: [
    {
      id: "OP17-103",
      artId: "OP17-103",
      setCode: "OP17",
      collectorNumber: "103",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-103_lL7kUAx.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP17",
  cost: 6,
  power: 4000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[Your Turn] [On Play] If your Leader has the {Big Mom Pirates} type, add up to 1 card from the top of your deck to the top of your Life cards. Then, give up to 1 of your opponent's Characters -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "leaderTrait",
            trait: "Big Mom Pirates",
            match: "includes",
          },
        ],
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op17CharlotteKatakuri103I18n,
};
