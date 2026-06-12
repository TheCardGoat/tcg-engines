import type { CharacterCard } from "@tcg/op-types";
import { op14eb04KouzukiSukiyaki014I18n } from "./014-kouzuki-sukiyaki.i18n.ts";

export const op14eb04KouzukiSukiyaki014: CharacterCard = {
  id: "EB04-014",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 0,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to your {Land of Wano} type Leader.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04KouzukiSukiyaki014I18n,
};
