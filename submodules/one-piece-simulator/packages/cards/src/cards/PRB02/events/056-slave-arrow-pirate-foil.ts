import type { EventCard } from "@tcg/op-types";
import { prb02SlaveArrowPirateFoil056I18n } from "./056-slave-arrow-pirate-foil.i18n.ts";

export const prb02SlaveArrowPirateFoil056: EventCard = {
  id: "OP07-056",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "PRB02",
  cost: 1,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-056_r1.jpg",
      imageId: "OP07-056_r1",
    },
  ],
  effect:
    "[Counter] You may return 1 of your Characters with a cost of 2 or more to the owner's hand: Up to 1 of your Leader or Character cards gains +4000 power during this battle.[Trigger] Draw 2 cards and place 2 cards from your hand at the bottom of your deck in any order.",
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
        optional: true,
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
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 2,
              },
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02SlaveArrowPirateFoil056I18n,
};
