import type { LeaderCard } from "@tcg/op-types";
import { st08MonkeyDLuffy001I18n } from "./st08-001-monkey-d-luffy.i18n.ts";
export const st08MonkeyDLuffy001: LeaderCard = {
  id: "ST08-001",
  canonicalId: "ST08-001",
  slug: "monkey-d-luffy/st08-001",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST08-001",
      artId: "ST08-001",
      setCode: "ST08",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-001.png",
    },
  ],
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "ST08",
  traits: ["Straw Hat Crew"],
  life: 5,
  power: 5000,
  attribute: "strike",
  effect: "[Your Turn] When a Character is K.O.'d, give up to 1 rested DON!! card to this Leader.",
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: st08MonkeyDLuffy001I18n,
};
