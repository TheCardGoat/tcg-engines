import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MonkeyDLuffyOp1434034I18n } from "./034-monkey-d-luffy-op14-34.i18n.ts";

export const op14eb04MonkeyDLuffyOp1434034: CharacterCard = {
  id: "OP14-034",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["FILM Straw Hat Crew Supernovas"],
  attribute: "strike",
  effect:
    "[Your Turn] All of your green {Straw Hat Crew} type Characters with a base cost of 4 or more gain +1000 power.\n[Once Per Turn] If your {Straw Hat Crew} type Character would be K.O.'d by your opponent's effect, you may rest 1 of your Characters instead.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "color",
                  value: "green",
                },
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                },
                {
                  filter: "baseCost",
                  comparison: "gte",
                  value: 4,
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
          },
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04MonkeyDLuffyOp1434034I18n,
};
