import type { CharacterCard } from "@tcg/op-types";
import { st04Jack008I18n } from "./st04-008-jack.i18n.ts";

export const st04Jack008: CharacterCard = {
  id: "ST04-008",
  canonicalId: "ST04-008",
  slug: "jack/st04-008",
  name: "Jack",
  printings: [
    {
      id: "ST04-008",
      artId: "ST04-008",
      setCode: "ST04",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-008.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 3,
  traits: ["Animal Kingdom Pirates"],
  power: 4000,
  attribute: "strike",
  counter: 1000,
  effect:
    "[On Play] You may trash 1 card from your hand: Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: st04Jack008I18n,
};
