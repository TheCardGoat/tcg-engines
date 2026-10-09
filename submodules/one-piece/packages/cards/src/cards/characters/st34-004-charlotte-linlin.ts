import type { CharacterCard } from "@tcg/op-types";
import { st34CharlotteLinlin004I18n } from "./st34-004-charlotte-linlin.i18n.ts";
export const st34CharlotteLinlin004: CharacterCard = {
  id: "ST34-004",
  canonicalId: "ST34-004",
  slug: "charlotte-linlin/st34-004",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "ST34-004",
      artId: "ST34-004",
      setCode: "ST34",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST34-004.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST34",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors", "Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On Play] DON!! −4, you may trash 1 card from your hand: Add up to 1 card from the top of your deck to the top of your Life cards. Then, up to 1 of your opponent's Characters' base power becomes 0 during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 4,
          },
          {
            cost: "trashFromHand",
            amount: 1,
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
            action: "setBasePower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 0,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st34CharlotteLinlin004I18n,
};
