import type { CharacterCard } from "@tcg/op-types";
import { op11LuffyTarouSp005I18n } from "./005-luffy-tarou-sp.i18n.ts";

export const op11LuffyTarouSp005: CharacterCard = {
  id: "ST18-005",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP11",
  cost: 7,
  power: 8000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    '[On Play] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 purple "Straw Hat Crew" type Character card with a cost of 5 or less from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "color",
                value: "purple",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op11LuffyTarouSp005I18n,
};
