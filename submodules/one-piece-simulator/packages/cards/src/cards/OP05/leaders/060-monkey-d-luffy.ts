import type { LeaderCard } from "@tcg/op-types";
import { op05MonkeyDLuffy060I18n } from "./060-monkey-d-luffy.i18n.ts";

export const op05MonkeyDLuffy060: LeaderCard = {
  id: "OP05-060",
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP05",
  power: 5000,
  life: 5,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-060_p1.jpg",
      imageId: "OP05-060_p1",
    },
  ],
  effect:
    "[Activate:Main][Once Per Turn] You may add 1 card from the top of your Life cards to your hand: If you have 0 or 3 or more DON!! cards on your field, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "eq",
                value: 0,
              },
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "gte",
                value: 3,
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05MonkeyDLuffy060I18n,
};
