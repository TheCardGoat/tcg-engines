import type { CharacterCard } from "@tcg/op-types";
import { op06VictoriaCindry091I18n } from "./091-victoria-cindry.i18n.ts";

export const op06VictoriaCindry091: CharacterCard = {
  id: "OP06-091",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP06",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the [Thriller Bark Pirates] type, trash 5 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 5,
          },
        ],
      },
    ],
  },
  i18n: op06VictoriaCindry091I18n,
};
