import type { LeaderCard } from "@tcg/op-types";
import { st03Crocodile001I18n } from "./st03-001-crocodile.i18n.ts";

export const st03Crocodile001: LeaderCard = {
  id: "ST03-001",
  canonicalId: "ST03-001",
  slug: "crocodile/st03-001",
  name: "Crocodile",
  printings: [
    {
      id: "ST03-001",
      artId: "ST03-001",
      setCode: "ST03",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-001.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "ST03",
  traits: ["The Seven Warlords of the Sea", "Baroque Works"],
  life: 5,
  power: 5000,
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] DON!! −4 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Return up to 1 Character with a cost of 5 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                  value: 5,
                },
              ],
            },
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 4,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st03Crocodile001I18n,
};
