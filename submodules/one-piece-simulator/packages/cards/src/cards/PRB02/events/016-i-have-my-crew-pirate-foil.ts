import type { EventCard } from "@tcg/op-types";
import { prb02IHaveMyCrewPirateFoil016I18n } from "./016-i-have-my-crew-pirate-foil.i18n.ts";

export const prb02IHaveMyCrewPirateFoil016: EventCard = {
  id: "ST14-016",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST14-016_r1.jpg",
      imageId: "ST14-016",
    },
  ],
  effect:
    "[Main] Draw 1 card. Then, up to 1 of your Characters gains +3 cost until the end of your opponent's next turn.[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02IHaveMyCrewPirateFoil016I18n,
};
