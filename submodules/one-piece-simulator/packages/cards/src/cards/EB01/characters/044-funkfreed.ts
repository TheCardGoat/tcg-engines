import type { CharacterCard } from "@tcg/op-types";
import { eb01Funkfreed044I18n } from "./044-funkfreed.i18n.ts";

export const eb01Funkfreed044: CharacterCard = {
  id: "EB01-044",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "slash",
  effect:
    "[Activate:Main] You may rest this Character: Up to 1 of your [Spandam] Characters gains +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Spandam",
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01Funkfreed044I18n,
};
