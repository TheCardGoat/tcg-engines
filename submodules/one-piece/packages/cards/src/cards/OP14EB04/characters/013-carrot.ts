import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Carrot013I18n } from "./013-carrot.i18n.ts";

export const op14eb04Carrot013: CharacterCard = {
  id: "EB04-013",
  canonicalId: "EB04-013",
  slug: "carrot/eb04-013",
  name: "Carrot",
  printings: [
    {
      id: "EB04-013",
      artId: "EB04-013",
      setCode: "OP14EB04",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-013_02aVati.jpg",
    },
    {
      id: "EB04-013_p1",
      artId: "EB04-013_p1",
      setCode: "OP14EB04",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-013_p1_8nR143E.jpg",
    },
  ],
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
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Minks",
                  match: "includes",
                },
              ],
            },
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Carrot013I18n,
};
