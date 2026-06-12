import type { CharacterCard } from "@tcg/op-types";
import { op11LordOfTheCoast028I18n } from "./028-lord-of-the-coast.i18n.ts";

export const op11LordOfTheCoast028: CharacterCard = {
  id: "OP11-028",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
  traits: ["East Blue Neptunian"],
  attribute: "strike",
  effect:
    "[On Play] Up to 1 of your opponent's rested Characters will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11LordOfTheCoast028I18n,
};
