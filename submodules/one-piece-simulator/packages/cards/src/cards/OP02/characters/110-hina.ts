import type { CharacterCard } from "@tcg/op-types";
import { op02Hina110I18n } from "./110-hina.i18n.ts";

export const op02Hina110: CharacterCard = {
  id: "OP02-110",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Block] Select up to 1 of your opponent's Characters with a cost of 6 or less. The selected Character cannot attack during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02Hina110I18n,
};
