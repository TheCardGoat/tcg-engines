import type { EventCard } from "@tcg/op-types";
import { prb01BarrierJollyRogerFoil095I18n } from "./095-barrier-jolly-roger-foil.i18n.ts";

export const prb01BarrierJollyRogerFoil095: EventCard = {
  id: "OP04-095",
  canonicalId: "OP04-095",
  slug: "barrier-jolly-roger-foil",
  name: "Barrier!! (Jolly Roger Foil)",
  printings: [
    {
      id: "OP04-095",
      artId: "OP04-095",
      setCode: "PRB01",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_p2.jpg",
    },
    {
      id: "OP04-095_p3",
      artId: "OP04-095_p3",
      setCode: "PRB01",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_p3.jpg",
    },
    {
      id: "OP04-095_r1",
      artId: "OP04-095_r1",
      setCode: "PRB01",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_r1.png",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  traits: ["Dressrosa Barto Club"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_p3.jpg",
      imageId: "OP04-095_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_r1.png",
      imageId: "OP04-095_r1",
    },
  ],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 15 or more cards in your trash, that card gains an additional +2000 power during this battle.[Trigger] Draw 2 cards and trash 1 card from your hand.",
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
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb01BarrierJollyRogerFoil095I18n,
};
