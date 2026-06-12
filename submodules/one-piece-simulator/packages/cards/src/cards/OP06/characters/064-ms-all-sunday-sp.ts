import type { CharacterCard } from "@tcg/op-types";
import { op06MsAllSundaySp064I18n } from "./064-ms-all-sunday-sp.i18n.ts";

export const op06MsAllSundaySp064: CharacterCard = {
  id: "OP04-064",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP06",
  cost: 5,
  power: 5000,
  trigger:
    "DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  traits: ["Baroque Works"],
  attribute: "wisdom",
  effect:
    "[On Play] Add up to 1 DON!! card from your DON!! deck and rest it. Then, if you have 6 or more DON!! cards on your field, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
  i18n: op06MsAllSundaySp064I18n,
};
