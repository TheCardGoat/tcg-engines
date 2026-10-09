import type { CharacterCard } from "@tcg/op-types";
import { st14Haredas008I18n } from "./st14-008-haredas.i18n.ts";
export const st14Haredas008: CharacterCard = {
  id: "ST14-008",
  canonicalId: "ST14-008",
  slug: "haredas/st14-008",
  name: "Haredas",
  printings: [
    {
      id: "ST14-008",
      artId: "ST14-008",
      setCode: "ST14",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-008.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST14",
  cost: 1,
  traits: ["Sky Island"],
  power: 0,
  attribute: "wisdom",
  counter: 2000,
  effect:
    "[Activate: Main] You may rest this Character: Up to 1 of your black {Straw Hat Crew} type Characters gains +2 cost until the end of your opponent's next turn. Then, if you have a Character with a cost of 8 or more, draw 1 card and trash 1 card from your hand.",
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
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 8,
                },
              ],
            },
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
            condition: {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 8,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st14Haredas008I18n,
};
