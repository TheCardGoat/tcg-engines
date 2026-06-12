import type { EventCard } from "@tcg/op-types";
import { prb01BlastBreathJollyRogerFoil016I18n } from "./016-blast-breath-jolly-roger-foil.i18n.ts";

export const prb01BlastBreathJollyRogerFoil016: EventCard = {
  id: "ST04-016",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-016_p3.jpg",
      imageId: "ST04-016_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-016_r1.png",
      imageId: "ST04-016_r1",
    },
  ],
  effect:
    "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your Leader or Character cards gains +4000 power during this battle.",
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: prb01BlastBreathJollyRogerFoil016I18n,
};
