import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Kuroobi045I18n } from "./045-kuroobi.i18n.ts";

export const op14eb04Kuroobi045: CharacterCard = {
  id: "OP14-045",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "strike",
  effect:
    "When a card is trashed from your hand by an effect, this Character gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)\n[On K.O.] Draw 1 card.",
  effects: {
    effects: [
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
  i18n: op14eb04Kuroobi045I18n,
};
