import type { CharacterCard } from "@tcg/op-types";
import { op03Zambai063I18n } from "./063-zambai.i18n.ts";

export const op03Zambai063: CharacterCard = {
  id: "OP03-063",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 2000,
  traits: ["Water Seven The Franky Family"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, draw 1 card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Water Seven",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
  i18n: op03Zambai063I18n,
};
