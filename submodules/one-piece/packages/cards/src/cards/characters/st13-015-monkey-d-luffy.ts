import type { CharacterCard } from "@tcg/op-types";
import { st13MonkeyDLuffy015I18n } from "./st13-015-monkey-d-luffy.i18n.ts";
export const st13MonkeyDLuffy015: CharacterCard = {
  id: "ST13-015",
  canonicalId: "ST13-015",
  slug: "monkey-d-luffy/st13-015",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST13-015",
      artId: "ST13-015",
      setCode: "ST13",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-015.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Supernovas", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Activate: Main] [Once Per Turn] This Character gains +2000 power until the start of your next turn. Then, if you have 1 or more Life cards, draw 1 card and trash 1 card from the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "untilStartOfNextTurn",
          },
          {
            action: "sequence",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "gte",
              value: 1,
            },
            actions: [
              {
                action: "draw",
                player: "self",
                amount: 1,
              },
              {
                action: "removeFromLife",
                player: "self",
                count: {
                  amount: 1,
                },
                destination: "trash",
                position: "top",
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st13MonkeyDLuffy015I18n,
};
