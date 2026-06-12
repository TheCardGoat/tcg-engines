import type { LeaderCard } from "@tcg/op-types";
import { op09Lim022I18n } from "./022-lim.i18n.ts";

export const op09Lim022: LeaderCard = {
  id: "OP09-022",
  cardType: "leader",
  color: ["green", "purple"],
  rarity: "L",
  setId: "OP09",
  power: 5000,
  life: 4,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-022_p1.jpg",
      imageId: "OP09-022_p1",
    },
  ],
  effect:
    'Your Character cards are played rested.\n[Activate: Main] [Once Per Turn] You may rest 3 of your DON!! cards: Add up to 1 DON!! card from your DON!! deck and rest it, and play up to 1 "ODYSSEY" type Character card with a cost of 5 or less from your hand.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op09Lim022I18n,
};
