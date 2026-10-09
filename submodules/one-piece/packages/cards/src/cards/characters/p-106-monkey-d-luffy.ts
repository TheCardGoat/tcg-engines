import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy106I18n } from "./p-106-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy106: CharacterCard = {
  id: "P-106",
  canonicalId: "P-106",
  slug: "monkey-d-luffy/p-106",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-106",
      artId: "P-106",
      setCode: "P",
      collectorNumber: "106",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-106.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Egghead", "The Four Emperors", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[End of Your Turn] You may turn 1 card from the top of your Life cards face-up: Set up to 1 of your {Egghead} type Characters as active.",
  trigger: "Draw 1 card and K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            faceUp: true,
            position: "top",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Egghead",
                  match: "exact",
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy106I18n,
};
