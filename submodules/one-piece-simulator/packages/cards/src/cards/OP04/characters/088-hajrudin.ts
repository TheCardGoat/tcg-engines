import type { CharacterCard } from "@tcg/op-types";
import { op04Hajrudin088I18n } from "./088-hajrudin.i18n.ts";

export const op04Hajrudin088: CharacterCard = {
  id: "OP04-088",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP04",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Giant New Giant Pirate Crew Dressrosa"],
  attribute: "strike",
  effect:
    "[Activate:Main] You may rest your 1 Leader: Give up to 1 of your opponent's Characters -4 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Hajrudin088I18n,
};
