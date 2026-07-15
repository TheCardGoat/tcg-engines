import type { EventCard } from "@tcg/op-types";
import { op10BarrierBarrierPistol060I18n } from "./060-barrier-barrier-pistol.i18n.ts";

export const op10BarrierBarrierPistol060: EventCard = {
  id: "OP10-060",
  canonicalId: "OP10-060",
  slug: "barrier-barrier-pistol",
  name: "Barrier-Barrier Pistol",
  printings: [
    {
      id: "OP10-060",
      artId: "OP10-060",
      setCode: "OP10",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-060.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Dressrosa Barto Club"],
  effect:
    "[Main] Place up to 1 of your opponent's Characters with 6000 power or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 6000,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10BarrierBarrierPistol060I18n,
};
