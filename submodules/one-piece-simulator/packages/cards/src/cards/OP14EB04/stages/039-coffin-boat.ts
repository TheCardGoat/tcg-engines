import type { StageCard } from "@tcg/op-types";
import { op14eb04CoffinBoat039I18n } from "./039-coffin-boat.i18n.ts";

export const op14eb04CoffinBoat039: StageCard = {
  id: "OP14-039",
  cardType: "stage",
  color: ["green"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  traits: ["The Seven Warlords of the Sea East Blue"],
  effect:
    "[On Play] If your Leader is [Dracule Mihawk], draw 1 card.\n[End of Your Turn] If your Leader is [Dracule Mihawk], set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Dracule Mihawk",
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
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "leaderName",
            name: "Dracule Mihawk",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04CoffinBoat039I18n,
};
