import type { LeaderCard } from "@tcg/op-types";
import { st10MonkeyDLuffy002I18n } from "./st10-002-monkey-d-luffy.i18n.ts";
export const st10MonkeyDLuffy002: LeaderCard = {
  id: "ST10-002",
  canonicalId: "ST10-002",
  slug: "monkey-d-luffy/st10-002",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST10-002",
      artId: "ST10-002",
      setCode: "ST10",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-002.png",
    },
  ],
  cardType: "leader",
  color: ["red", "purple"],
  rarity: "L",
  setId: "ST10",
  power: 6000,
  life: 3,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Activate: Main] [Once Per Turn] If you have 0 DON!! cards on your field or 8 or more DON!! cards on your field, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "eq",
                value: 0,
              },
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "gte",
                value: 8,
              },
            ],
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
  i18n: st10MonkeyDLuffy002I18n,
};
