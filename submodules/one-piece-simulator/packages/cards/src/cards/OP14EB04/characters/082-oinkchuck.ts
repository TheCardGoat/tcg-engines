import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Oinkchuck082I18n } from "./082-oinkchuck.i18n.ts";

export const op14eb04Oinkchuck082: CharacterCard = {
  id: "OP14-082",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  effect:
    "[On K.O.] All of your {Thriller Bark Pirates} type Characters gain +4 cost until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Thriller Bark Pirates",
                },
              ],
            },
            value: 4,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Oinkchuck082I18n,
};
