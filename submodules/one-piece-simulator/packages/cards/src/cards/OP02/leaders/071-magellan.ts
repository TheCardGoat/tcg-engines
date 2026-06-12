import type { LeaderCard } from "@tcg/op-types";
import { op02Magellan071I18n } from "./071-magellan.i18n.ts";

export const op02Magellan071: LeaderCard = {
  id: "OP02-071",
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP02",
  power: 6000,
  life: 5,
  traits: ["Impel Down"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-071_p1.jpg",
      imageId: "OP02-071_p1",
    },
  ],
  effect:
    "[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, this Leader gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op02Magellan071I18n,
};
