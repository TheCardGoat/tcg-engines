import type { CharacterCard } from "@tcg/op-types";
import { op11JaguarDSaul075I18n } from "./075-jaguar-d-saul.i18n.ts";

export const op11JaguarDSaul075: CharacterCard = {
  id: "OP11-075",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  power: 6000,
  trigger: "Activate this card's [On Play] effect.",
  traits: ["Giant Former Navy Ohara"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader is [Nico Robin] and you have 7 or more DON!! cards on your field, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderName",
                name: "Nico Robin",
              },
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "gte",
                value: 7,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op11JaguarDSaul075I18n,
};
