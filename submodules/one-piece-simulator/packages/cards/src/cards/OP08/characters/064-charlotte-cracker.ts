import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteCracker064I18n } from "./064-charlotte-cracker.i18n.ts";

export const op08CharlotteCracker064: CharacterCard = {
  id: "OP08-064",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[Activate:Main] [Once Per Turn] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [Biscuit Warrior] from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                filter: "name",
                value: "Biscuit Warrior",
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08CharlotteCracker064I18n,
};
