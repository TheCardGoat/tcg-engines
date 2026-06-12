import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Trebol068I18n } from "./068-trebol.i18n.ts";

export const op14eb04Trebol068: CharacterCard = {
  id: "OP14-068",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Opponent's Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, if your Leader has the {Donquixote Pirates} type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Trebol068I18n,
};
