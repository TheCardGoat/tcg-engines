import type { CharacterCard } from "@tcg/op-types";
import { op11VinsmokeJudge044I18n } from "./044-vinsmoke-judge.i18n.ts";

export const op11VinsmokeJudge044: CharacterCard = {
  id: "OP11-044",
  canonicalId: "OP11-044",
  slug: "vinsmoke-judge/op11-044",
  name: "Vinsmoke Judge",
  printings: [
    {
      id: "OP11-044",
      artId: "OP11-044",
      setCode: "OP11",
      collectorNumber: "044",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-044.jpg",
    },
  ],
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
                  match: "includes",
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
