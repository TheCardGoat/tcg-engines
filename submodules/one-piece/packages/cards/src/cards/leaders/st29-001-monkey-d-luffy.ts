import type { LeaderCard } from "@tcg/op-types";
import { st29MonkeyDLuffy001I18n } from "./st29-001-monkey-d-luffy.i18n.ts";
export const st29MonkeyDLuffy001: LeaderCard = {
  id: "ST29-001",
  canonicalId: "ST29-001",
  slug: "monkey-d-luffy/st29-001",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST29-001",
      artId: "ST29-001",
      setCode: "ST29",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-001.png",
    },
  ],
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "ST29",
  life: 6,
  power: 5000,
  traits: ["Egghead", "The Four Emperors", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[When Attacking] If you have 2 or less Life cards, draw 1 card and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st29MonkeyDLuffy001I18n,
};
