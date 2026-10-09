import type { CharacterCard } from "@tcg/op-types";
import { st14Heracles011I18n } from "./st14-011-heracles.i18n.ts";
export const st14Heracles011: CharacterCard = {
  id: "ST14-011",
  canonicalId: "ST14-011",
  slug: "heracles/st14-011",
  name: "Heracles",
  printings: [
    {
      id: "ST14-011",
      artId: "ST14-011",
      setCode: "ST14",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-011.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST14",
  cost: 1,
  traits: ["Bowin Island"],
  power: 2000,
  attribute: "wisdom",
  counter: 2000,
  effect:
    "[Activate: Main] You may rest this Character: Up to 1 of your black {Straw Hat Crew} type Characters gains +2 cost until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "black",
                },
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                  match: "exact",
                },
              ],
            },
            value: 2,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st14Heracles011I18n,
};
