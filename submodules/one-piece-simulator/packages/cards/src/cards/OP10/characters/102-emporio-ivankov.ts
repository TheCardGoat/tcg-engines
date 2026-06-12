import type { CharacterCard } from "@tcg/op-types";
import { op10EmporioIvankov102I18n } from "./102-emporio-ivankov.i18n.ts";

export const op10EmporioIvankov102: CharacterCard = {
  id: "OP10-102",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    '[Activate: Main] [Once Per Turn] Up to 3 of your "Revolutionary Army" type Characters gain +1000 power during this turn. Then, add 1 card from the top of your Life cards to your hand.',
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
                amount: 3,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Revolutionary Army",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10EmporioIvankov102I18n,
};
