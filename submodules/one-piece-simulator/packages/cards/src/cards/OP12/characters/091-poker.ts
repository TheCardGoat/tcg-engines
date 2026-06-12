import type { CharacterCard } from "@tcg/op-types";
import { op12Poker091I18n } from "./091-poker.i18n.ts";

export const op12Poker091: CharacterCard = {
  id: "OP12-091",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "strike",
  effect:
    '[Activate: Main] [Once Per Turn] You may place 3 cards from your trash at the bottom of your deck in any order: Up to 2 of your "SMILE" type Characters gain +2000 power during this turn.',
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
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "SMILE",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12Poker091I18n,
};
