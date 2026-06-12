import type { LeaderCard } from "@tcg/op-types";
import { op14eb04JinbeOp14040040I18n } from "./040-jinbe-op14-040.i18n.ts";

export const op14eb04JinbeOp14040040: LeaderCard = {
  id: "OP14-040",
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP14EB04",
  power: 5000,
  life: 5,
  traits: ["Fish-Man The Seven Warlords of the Sea The Sun Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-040_p1_W5xIfK8.jpg",
      imageId: "OP14-040_p1",
    },
  ],
  effect:
    "[Activate: Main] You may trash 1 card from your hand: Give up to 2 rested DON!! cards to 1 of your {Fish-Man} or {Merfolk} type Leader or Character cards.",
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
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Fish-Man",
                },
                {
                  filter: "trait",
                  value: "Merfolk",
                },
              ],
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04JinbeOp14040040I18n,
};
