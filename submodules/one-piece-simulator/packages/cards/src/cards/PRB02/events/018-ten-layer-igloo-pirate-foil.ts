import type { EventCard } from "@tcg/op-types";
import { prb02TenLayerIglooPirateFoil018I18n } from "./018-ten-layer-igloo-pirate-foil.i18n.ts";

export const prb02TenLayerIglooPirateFoil018: EventCard = {
  id: "OP10-018",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  traits: ["Donquixote Pirates Punk Hazard"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-018_r1.jpg",
      imageId: "OP10-018_r1",
    },
  ],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, give up to 1 of your opponent's Leader or Character cards 2000 power during this turn.[Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
            value: 3000,
            duration: "thisBattle",
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02TenLayerIglooPirateFoil018I18n,
};
