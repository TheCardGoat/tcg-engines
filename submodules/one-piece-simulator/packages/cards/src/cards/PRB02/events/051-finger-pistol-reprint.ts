import type { EventCard } from "@tcg/op-types";
import { prb02FingerPistolReprint051I18n } from "./051-finger-pistol-reprint.i18n.ts";

export const prb02FingerPistolReprint051: EventCard = {
  id: "EB01-051",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  traits: ["CP9"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-051_p1.jpg",
      imageId: "EB01-051_p1",
    },
  ],
  effect:
    '[Main] You may trash 2 cards from the top of your deck: K.O. up to 1 of your opponent\'s Characters with a cost of 5 or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02FingerPistolReprint051I18n,
};
