import type { CharacterCard } from "@tcg/op-types";
import { st29MonkeyDLuffy012I18n } from "./st29-012-monkey-d-luffy.i18n.ts";
export const st29MonkeyDLuffy012: CharacterCard = {
  id: "ST29-012",
  canonicalId: "ST29-012",
  slug: "monkey-d-luffy/st29-012",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST29-012",
      artId: "ST29-012",
      setCode: "ST29",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-012.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Egghead", "The Four Emperors", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your [Monkey.D.Luffy] cards.",
  trigger: "Play this card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: st29MonkeyDLuffy012I18n,
};
