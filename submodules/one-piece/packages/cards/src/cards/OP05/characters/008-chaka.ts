import type { CharacterCard } from "@tcg/op-types";
import { op05Chaka008I18n } from "./008-chaka.i18n.ts";

export const op05Chaka008: CharacterCard = {
  id: "OP05-008",
  canonicalId: "OP05-008",
  slug: "chaka/op05-008",
  name: "Chaka",
  printings: [
    {
      id: "OP05-008",
      artId: "OP05-008",
      setCode: "OP05",
      collectorNumber: "008",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-008.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "slash",
  effect:
    "[DON!! x1][Activate:Main][Once Per Turn] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Chaka008I18n,
};
