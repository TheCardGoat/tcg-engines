import type { EventCard } from "@tcg/op-types";
import { eb02ClovenRoseBlizzard007I18n } from "./007-cloven-rose-blizzard.i18n.ts";

export const eb02ClovenRoseBlizzard007: EventCard = {
  id: "EB02-007",
  canonicalId: "EB02-007",
  slug: "cloven-rose-blizzard",
  name: "Cloven Rose Blizzard",
  printings: [
    {
      id: "EB02-007",
      artId: "EB02-007",
      setCode: "EB02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-007.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "EB02",
  cost: 3,
  trigger: "K.O. up to 1 of your opponent's Characters with 4000 power or less.",
  traits: ["Animal Straw Hat Crew Water Seven"],
  effect:
    "[Main] Up to a total of 3 of your Leader and Character cards gain +1000 power during this turn. Then, K.O. up to 1 of your opponent's Characters with 3000 power or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
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
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb02ClovenRoseBlizzard007I18n,
};
