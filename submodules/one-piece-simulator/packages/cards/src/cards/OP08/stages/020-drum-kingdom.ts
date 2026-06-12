import type { StageCard } from "@tcg/op-types";
import { op08DrumKingdom020I18n } from "./020-drum-kingdom.i18n.ts";

export const op08DrumKingdom020: StageCard = {
  id: "OP08-020",
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  traits: ["Drum Kingdom"],
  effect: "[Opponent's Turn] All of your [Drum Kingdom] type Characters gain +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Drum Kingdom",
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op08DrumKingdom020I18n,
};
