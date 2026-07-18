import type { LeaderCard } from "@tcg/op-types";
import { op14eb04JinbeOp14040040I18n } from "./040-jinbe-op14-040.i18n.ts";

export const op14eb04JinbeOp14040040: LeaderCard = {
  id: "OP14-040",
  canonicalId: "OP14-040",
  slug: "jinbe-op14-040",
  name: "Jinbe - OP14-040",
  printings: [
    {
      id: "OP14-040",
      artId: "OP14-040",
      setCode: "OP14EB04",
      collectorNumber: "040",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-040_vYlJn49.jpg",
    },
    {
      id: "OP14-040_p1",
      artId: "OP14-040_p1",
      setCode: "OP14EB04",
      collectorNumber: "040",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-040_p1_W5xIfK8.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP14EB04",
  power: 5000,
  life: 5,
  traits: ["Fish-Man", "The Seven Warlords of the Sea", "The Sun Pirates"],
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
                  filter: "anyOf",
                  groups: [
                    [{ filter: "trait", value: "Fish-Man", match: "includes" }],
                    [{ filter: "trait", value: "Merfolk", match: "includes" }],
                  ],
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
