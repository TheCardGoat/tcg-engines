import type { LeaderCard } from "@tcg/op-types";
import { op01Kaido061I18n } from "./061-kaido.i18n.ts";

export const op01Kaido061: LeaderCard = {
  id: "OP01-061",
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 4,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-061_p1.jpg",
      imageId: "OP01-061_p1",
    },
  ],
  effect:
    "[DON!! x1] [Your Turn] [Once Per Turn] When your opponent's Character is K.O.'d, add up to 1 DON!! card from your DON!! deck and set it as active.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op01Kaido061I18n,
};
