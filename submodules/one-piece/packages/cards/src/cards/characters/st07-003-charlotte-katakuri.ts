import type { CharacterCard } from "@tcg/op-types";
import { st07CharlotteKatakuri003I18n } from "./st07-003-charlotte-katakuri.i18n.ts";
export const st07CharlotteKatakuri003: CharacterCard = {
  id: "ST07-003",
  canonicalId: "ST07-003",
  slug: "charlotte-katakuri/st07-003",
  name: "Charlotte Katakuri",
  printings: [
    {
      id: "ST07-003",
      artId: "ST07-003",
      setCode: "ST07",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-003.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST07",
  cost: 4,
  traits: ["Big Mom Pirates"],
  power: 6000,
  attribute: "strike",
  effect:
    "[On Play] Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards. Then, if you have less Life cards than your opponent, this Character gains [Rush] during this turn.(This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "lookAtLife",
            player: "either",
            position: "topOrBottom",
            upTo: true,
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
              condition: "lifeComparison",
              selfComparison: "lt",
            },
          },
        ],
      },
    ],
  },
  i18n: st07CharlotteKatakuri003I18n,
};
