import type { CharacterCard } from "@tcg/op-types";
import { st07CharlottePudding008I18n } from "./st07-008-charlotte-pudding.i18n.ts";
export const st07CharlottePudding008: CharacterCard = {
  id: "ST07-008",
  canonicalId: "ST07-008",
  slug: "charlotte-pudding/st07-008",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "ST07-008",
      artId: "ST07-008",
      setCode: "ST07",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-008.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 2,
  traits: ["Big Mom Pirates"],
  power: 3000,
  attribute: "wisdom",
  counter: 2000,
  effect:
    "[On Play] Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards.",
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
        ],
      },
    ],
  },
  i18n: st07CharlottePudding008I18n,
};
