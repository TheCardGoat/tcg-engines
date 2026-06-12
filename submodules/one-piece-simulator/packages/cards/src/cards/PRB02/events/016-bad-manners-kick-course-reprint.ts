import type { EventCard } from "@tcg/op-types";
import { prb02BadMannersKickCourseReprint016I18n } from "./016-bad-manners-kick-course-reprint.i18n.ts";

export const prb02BadMannersKickCourseReprint016: EventCard = {
  id: "OP04-016",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "PRB02",
  cost: 0,
  traits: ["Alabasta Straw Hat Crew"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-016_p1.jpg",
      imageId: "OP04-016_P1",
    },
  ],
  effect:
    '[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle.[Trigger] Give up to 1 of your opponent\'s Leader or Character cards -3000 power during this turn.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02BadMannersKickCourseReprint016I18n,
};
