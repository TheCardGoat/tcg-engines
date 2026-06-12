import type { EventCard } from "@tcg/op-types";
import { prb02SlowSlowBeamSwordPirateFoil076I18n } from "./076-slow-slow-beam-sword-pirate-foil.i18n.ts";

export const prb02SlowSlowBeamSwordPirateFoil076: EventCard = {
  id: "OP07-076",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  traits: ["Foxy Pirates"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-076_r1.jpg",
      imageId: "OP07-076",
    },
  ],
  effect:
    "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, rest up to 1 of your opponent's Characters.[Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "trigger",
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
  i18n: prb02SlowSlowBeamSwordPirateFoil076I18n,
};
