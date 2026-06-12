import type { CharacterCard } from "@tcg/op-types";
import { op11LuckyRouxTr015I18n } from "./015-lucky-roux-tr.i18n.ts";

export const op11LuckyRouxTr015: CharacterCard = {
  id: "OP09-015",
  cardType: "character",
  color: ["red"],
  rarity: "TR",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On K.O.] If your Leader has the "Red-Haired Pirates" type, K.O. up to 1 of your opponent\'s Characters with a base power of 6000 or less.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Red-Haired Pirates",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 6000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11LuckyRouxTr015I18n,
};
