import type { CharacterCard } from "@tcg/op-types";
import { op10Perona092I18n } from "./092-perona.i18n.ts";

export const op10Perona092: CharacterCard = {
  id: "OP10-092",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  effect:
    '[Activate: Main] [Once Per Turn] You may place 2 "Thriller Bark Pirates" type cards from your trash at the bottom of your deck in any order: Up to 1 of your Characters other than [Perona] gains +2000 power during this turn.',
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
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "excludeName",
                  value: "Perona",
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
  i18n: op10Perona092I18n,
};
