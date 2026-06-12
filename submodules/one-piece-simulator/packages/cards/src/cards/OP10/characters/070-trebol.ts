import type { CharacterCard } from "@tcg/op-types";
import { op10Trebol070I18n } from "./070-trebol.i18n.ts";

export const op10Trebol070: CharacterCard = {
  id: "OP10-070",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] All of your Characters with 1000 base power or less cannot be K.O.'d by your opponent's effects until the end of your opponent's next turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 1000,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
            restriction: "byEffect",
          },
        ],
      },
    ],
  },
  i18n: op10Trebol070I18n,
};
