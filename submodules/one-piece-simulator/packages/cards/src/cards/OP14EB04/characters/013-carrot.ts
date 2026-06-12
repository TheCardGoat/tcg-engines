import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Carrot013I18n } from "./013-carrot.i18n.ts";

export const op14eb04Carrot013: CharacterCard = {
  id: "EB04-013",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 8,
  power: 9000,
  traits: ["Minks"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-013_p1_8nR143E.jpg",
      imageId: "EB04-013_p1",
    },
  ],
  effect:
    "[On Play] If your Leader has the {Minks} type, set up to 2 of your {Minks} type Characters and your Leader as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Minks",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character", "leader"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Minks",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Carrot013I18n,
};
