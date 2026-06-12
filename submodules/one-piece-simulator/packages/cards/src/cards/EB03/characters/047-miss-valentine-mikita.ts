import type { CharacterCard } from "@tcg/op-types";
import { eb03MissValentineMikita047I18n } from "./047-miss-valentine-mikita.i18n.ts";

export const eb03MissValentineMikita047: CharacterCard = {
  id: "EB03-047",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB03",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect: "[On Play] Trash 3 cards from the top of your deck.\n[On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb03MissValentineMikita047I18n,
};
