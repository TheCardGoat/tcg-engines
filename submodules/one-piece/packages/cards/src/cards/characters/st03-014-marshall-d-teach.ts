import type { CharacterCard } from "@tcg/op-types";
import { st03MarshallDTeach014I18n } from "./st03-014-marshall-d-teach.i18n.ts";

export const st03MarshallDTeach014: CharacterCard = {
  id: "ST03-014",
  canonicalId: "ST03-014",
  slug: "marshall-d-teach/st03-014",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "ST03-014",
      artId: "ST03-014",
      setCode: "ST03",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-014.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["The Seven Warlords of the Sea", "Blackbeard Pirates"],
  cost: 4,
  power: 4000,
  attribute: "special",
  counter: 1000,
  effect: "[On Play] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st03MarshallDTeach014I18n,
};
