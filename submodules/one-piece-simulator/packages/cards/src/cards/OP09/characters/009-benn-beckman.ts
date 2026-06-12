import type { CharacterCard } from "@tcg/op-types";
import { op09BennBeckman009I18n } from "./009-benn-beckman.i18n.ts";

export const op09BennBeckman009: CharacterCard = {
  id: "OP09-009",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP09",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-009_p1.jpg",
      imageId: "OP09-009_p1",
    },
  ],
  effect: "[On Play] Trash up to 1 of your opponent's Characters with 6000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromField",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 6000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09BennBeckman009I18n,
};
