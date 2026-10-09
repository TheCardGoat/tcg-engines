import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy033I18n } from "./p-033-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy033: CharacterCard = {
  id: "P-033",
  canonicalId: "P-033",
  slug: "monkey-d-luffy/p-033",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-033",
      artId: "P-033",
      setCode: "P",
      collectorNumber: "033",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-033.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Activate: Main] You may place this Character at the bottom of the owner's deck: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToDeck",
            position: "bottom",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: pMonkeyDLuffy033I18n,
};
