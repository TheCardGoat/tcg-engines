import type { CharacterCard } from "@tcg/op-types";
import { op03Jango028I18n } from "./028-jango.i18n.ts";

export const op03Jango028: CharacterCard = {
  id: "OP03-028",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP03",
  cost: 5,
  power: 6000,
  traits: ["East Blue Black Cat Pirates"],
  attribute: "special",
  effect:
    "[On Play] Choose one: • Set up to 1 of your [East Blue] type Leader or Character cards with a cost of 6 or less as active. • Rest this Character and up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "setActive",
                  target: {
                    player: "self",
                    zones: ["leader", "character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "trait",
                        value: "East Blue",
                      },
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 6,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "rest",
                  target: {
                    player: "self",
                    zones: ["character"],
                    count: {
                      amount: 1,
                    },
                    self: true,
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op03Jango028I18n,
};
