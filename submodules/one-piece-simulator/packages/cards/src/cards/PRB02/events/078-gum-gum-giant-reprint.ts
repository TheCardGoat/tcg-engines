import type { EventCard } from "@tcg/op-types";
import { prb02GumGumGiantReprint078I18n } from "./078-gum-gum-giant-reprint.i18n.ts";

export const prb02GumGumGiantReprint078: EventCard = {
  id: "OP09-078",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  traits: ["Straw Hat Crew The Four Emperors"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-078_p1_QtJ1DiN.jpg",
      imageId: "OP09-078_p1",
    },
  ],
  effect:
    '[Counter] DON!! 2, You may trash 1 card from your hand: If your Leader has the "Straw Hat Crew" type, up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, draw 2 cards.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
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
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02GumGumGiantReprint078I18n,
};
