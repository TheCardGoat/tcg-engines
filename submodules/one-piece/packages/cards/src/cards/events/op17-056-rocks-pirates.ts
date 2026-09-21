import type { EventCard } from "@tcg/op-types";
import { op17RocksPirates056I18n } from "./op17-056-rocks-pirates.i18n.ts";

export const op17RocksPirates056: EventCard = {
  id: "OP17-056",
  canonicalId: "OP17-056",
  slug: "rocks-pirates/op17-056",
  name: "Rocks Pirates",
  printings: [
    {
      id: "OP17-056",
      artId: "OP17-056",
      setCode: "OP17",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-056_RYNYgVN.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP17",
  cost: 0,
  traits: ["Rocks Pirates"],
  effect:
    '[Main] You may rest 5 of your DON!! cards: Return up to 1 Character with a cost of 6 or less to the owner\'s hand.\n\n[Counter] Up to 1 of your Leader with a type including "Rocks Pirates" or up to 1 of your Characters with a type including "Rocks Pirates" gains +2000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 5,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17RocksPirates056I18n,
};
