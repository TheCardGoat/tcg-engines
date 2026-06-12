import type { CharacterCard } from "@tcg/op-types";
import { op11VinsmokeJudge044I18n } from "./044-vinsmoke-judge.i18n.ts";

export const op11VinsmokeJudge044: CharacterCard = {
  id: "OP11-044",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  power: 8000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "slash",
  effect:
    '[Activate: Main] [Once Per Turn] You may trash 1 card from your hand: All of your "GERMA 66" type Characters gain +1000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
                  value: "GERMA 66",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11VinsmokeJudge044I18n,
};
