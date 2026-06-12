import type { EventCard } from "@tcg/op-types";
import { op03HullDismantlerSlash073I18n } from "./073-hull-dismantler-slash.i18n.ts";

export const op03HullDismantlerSlash073: EventCard = {
  id: "OP03-073",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  traits: ["Water Seven The Franky Family"],
  effect:
    "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, K.O. up to 1 of your opponent's Characters with a cost of 2 or less. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op03HullDismantlerSlash073I18n,
};
