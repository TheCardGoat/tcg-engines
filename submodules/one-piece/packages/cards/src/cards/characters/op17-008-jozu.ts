import type { CharacterCard } from "@tcg/op-types";
import { op17Jozu008I18n } from "./op17-008-jozu.i18n.ts";

export const op17Jozu008: CharacterCard = {
  id: "OP17-008",
  canonicalId: "OP17-008",
  slug: "jozu/op17-008",
  name: "Jozu",
  printings: [
    {
      id: "OP17-008",
      artId: "OP17-008",
      setCode: "OP17",
      collectorNumber: "008",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-008_6u3rnUo.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP17",
  cost: 6,
  power: 8000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    "[On Play] Your [Edward.Newgate] Leader's base power becomes 8000 until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Edward.Newgate",
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 8000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op17Jozu008I18n,
};
