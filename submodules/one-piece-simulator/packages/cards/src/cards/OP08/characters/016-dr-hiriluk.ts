import type { CharacterCard } from "@tcg/op-types";
import { op08DrHiriluk016I18n } from "./016-dr-hiriluk.i18n.ts";

export const op08DrHiriluk016: CharacterCard = {
  id: "OP08-016",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP08",
  cost: 3,
  power: 0,
  counter: 2000,
  traits: ["Drum Kingdom"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may rest this Character: If your Leader is [Tony Tony.Chopper], all of your [Tony Tony.Chopper] Characters gain +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Tony Tony.Chopper",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
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
                  filter: "name",
                  value: "Tony Tony.Chopper",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08DrHiriluk016I18n,
};
