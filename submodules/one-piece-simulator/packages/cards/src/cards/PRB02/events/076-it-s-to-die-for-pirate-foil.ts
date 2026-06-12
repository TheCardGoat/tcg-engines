import type { EventCard } from "@tcg/op-types";
import { prb02ItSToDieForPirateFoil076I18n } from "./076-it-s-to-die-for-pirate-foil.i18n.ts";

export const prb02ItSToDieForPirateFoil076: EventCard = {
  id: "OP08-076",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "PRB02",
  cost: 3,
  traits: ["The Four Emperors Big Mom Pirates"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-076_r1.jpg",
      imageId: "OP08-076_r1",
    },
  ],
  effect:
    "[Main] Add up to 1 DON!! card from your DON!! deck and set it as active. Then, if your opponent has a Character with 6000 power or more, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
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
      },
    ],
  },
  i18n: prb02ItSToDieForPirateFoil076I18n,
};
