import type { CharacterCard } from "@tcg/op-types";
import { st36Killer002I18n } from "./st36-002-killer.i18n.ts";
export const st36Killer002: CharacterCard = {
  id: "ST36-002",
  canonicalId: "ST36-002",
  slug: "killer/st36-002",
  name: "Killer",
  printings: [
    {
      id: "ST36-002",
      artId: "ST36-002",
      setCode: "ST36",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST36-002.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST36",
  cost: 4,
  traits: ["Supernovas", "Kid Pirates"],
  power: 6000,
  attribute: "slash",
  effect:
    "[Your Turn] [On Play] If your Leader has the {Kid Pirates} type, add up to 1 card from the top of your deck to the top of your Life cards.",
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
            trait: "Kid Pirates",
            match: "exact",
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
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  trigger: "[Trigger] If your opponent has 3 or less Life cards, play this card.",
  i18n: st36Killer002I18n,
};
