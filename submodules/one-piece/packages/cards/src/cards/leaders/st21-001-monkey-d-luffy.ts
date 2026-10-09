import type { LeaderCard } from "@tcg/op-types";
import { st21MonkeyDLuffy001I18n } from "./st21-001-monkey-d-luffy.i18n.ts";
export const st21MonkeyDLuffy001: LeaderCard = {
  id: "ST21-001",
  canonicalId: "ST21-001",
  slug: "monkey-d-luffy/st21-001",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST21-001",
      artId: "ST21-001",
      setCode: "ST21",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-001.png",
    },
  ],
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "ST21",
  life: 5,
  traits: ["The Four Emperors", "Straw Hat Crew"],
  power: 5000,
  attribute: "strike",
  effect:
    "[DON!! x1] [Activate: Main] [Once Per Turn] Give up to 2 rested DON!! cards to 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st21MonkeyDLuffy001I18n,
};
