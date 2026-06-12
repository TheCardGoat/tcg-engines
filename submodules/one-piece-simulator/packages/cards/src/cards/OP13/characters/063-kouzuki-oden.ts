import type { CharacterCard } from "@tcg/op-types";
import { op13KouzukiOden063I18n } from "./063-kouzuki-oden.i18n.ts";

export const op13KouzukiOden063: CharacterCard = {
  id: "OP13-063",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan Roger Pirates"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If you have any DON!! cards given, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donGiven",
            player: "self",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13KouzukiOden063I18n,
};
