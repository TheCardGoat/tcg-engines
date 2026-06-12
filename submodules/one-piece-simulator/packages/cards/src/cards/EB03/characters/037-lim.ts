import type { CharacterCard } from "@tcg/op-types";
import { eb03Lim037I18n } from "./037-lim.i18n.ts";

export const eb03Lim037: CharacterCard = {
  id: "EB03-037",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "EB03",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  effect:
    "[On Play] If you have 7 or more DON!! cards on your field, all of your {ODYSSEY} type Leader and Character cards gain +1000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "ODYSSEY",
                },
              ],
            },
            value: 1000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: eb03Lim037I18n,
};
