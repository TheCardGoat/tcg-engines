import type { LeaderCard } from "@tcg/op-types";
import { pNami117I18n } from "./p-117-nami.i18n.ts";
export const pNami117: LeaderCard = {
  id: "P-117",
  canonicalId: "P-117",
  slug: "nami/p-117",
  name: "Nami",
  printings: [
    {
      id: "P-117",
      artId: "P-117",
      setCode: "P",
      collectorNumber: "117",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-117.png",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  life: 5,
  power: 5000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "Under the rules of this game, you can only include {East Blue} type cards in your deck and when your deck is reduced to 0, you win the game instead of losing. [DON!! x1] When this Leader's attack deals damage to your opponent's Life, you may trash 1 card from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenDealsDamage",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
    deckBuildingRules: [
      {
        rule: "cannotInclude",
        filters: [
          {
            filter: "trait",
            value: "East Blue",
            match: "exact",
            negate: true,
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "loseGame",
        replacementAction: {
          action: "winGame",
        },
      },
    ],
  },
  i18n: pNami117I18n,
};
