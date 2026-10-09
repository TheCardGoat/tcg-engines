import type { CharacterCard } from "@tcg/op-types";
import { st23MonkeyDLuffy004I18n } from "./st23-004-monkey-d-luffy.i18n.ts";
export const st23MonkeyDLuffy004: CharacterCard = {
  id: "ST23-004",
  canonicalId: "ST23-004",
  slug: "monkey-d-luffy/st23-004",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST23-004",
      artId: "ST23-004",
      setCode: "ST23",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST23-004.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST23",
  cost: 1,
  traits: ["FILM", "Supernovas", "Straw Hat Crew"],
  power: 2000,
  attribute: "strike",
  counter: 1000,
  effect:
    "[Activate: Main] You may rest 1 of your DON!! cards and this Character: Give up to 1 of your opponent's Characters −1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st23MonkeyDLuffy004I18n,
};
