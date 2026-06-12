import type { LeaderCard } from "@tcg/op-types";
import { op03Iceburg058I18n } from "./058-iceburg.i18n.ts";

export const op03Iceburg058: LeaderCard = {
  id: "OP03-058",
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 5,
  traits: ["Galley-La Company Water Seven"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-058_p1.jpg",
      imageId: "OP03-058_p1",
    },
  ],
  effect:
    "This Leader cannot attack. [Activate:Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may rest this Leader: Play up to 1 [Galley-La Company] type Character card with a cost of 5 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "Galley-La Company",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03Iceburg058I18n,
};
