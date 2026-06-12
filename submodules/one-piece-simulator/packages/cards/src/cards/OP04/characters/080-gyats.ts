import type { CharacterCard } from "@tcg/op-types";
import { op04Gyats080I18n } from "./080-gyats.i18n.ts";

export const op04Gyats080: CharacterCard = {
  id: "OP04-080",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP04",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Dressrosa"],
  attribute: "wisdom",
  effect:
    "[On Play] Up to 1 of your [Dressrosa] type Characters can also attack active Characters during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Dressrosa",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op04Gyats080I18n,
};
