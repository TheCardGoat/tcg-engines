import type { CharacterCard } from "@tcg/op-types";
import { op12Sentomaru104I18n } from "./104-sentomaru.i18n.ts";

export const op12Sentomaru104: CharacterCard = {
  id: "OP12-104",
  canonicalId: "OP12-104",
  slug: "sentomaru/op12-104",
  name: "Sentomaru",
  printings: [
    {
      id: "OP12-104",
      artId: "OP12-104",
      setCode: "OP12",
      collectorNumber: "104",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-104_PtP8riJ.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Navy Egghead"],
  attribute: "slash",
  effect: "[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "trigger",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12Sentomaru104I18n,
};
