import type { CharacterCard } from "@tcg/op-types";
import { eb01MsMonday035I18n } from "./035-ms-monday.i18n.ts";

export const eb01MsMonday035: CharacterCard = {
  id: "EB01-035",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB01",
  cost: 3,
  power: 5000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    '[On Play] If your Leader\'s type includes "Baroque Works", up to 1 of your Leader or Character cards gains +1000 power during this turn.[Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
            },
          },
        ],
      },
    ],
  },
  i18n: eb01MsMonday035I18n,
};
