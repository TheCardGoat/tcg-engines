import type { CharacterCard } from "@tcg/op-types";
import { op11StussySp085I18n } from "./085-stussy-sp.i18n.ts";

export const op11StussySp085: CharacterCard = {
  id: "OP07-085",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP11",
  cost: 9,
  power: 9000,
  traits: ["CP0"],
  attribute: "special",
  effect:
    "[On Play]You may trash 1 of your Characters: K.O. up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11StussySp085I18n,
};
