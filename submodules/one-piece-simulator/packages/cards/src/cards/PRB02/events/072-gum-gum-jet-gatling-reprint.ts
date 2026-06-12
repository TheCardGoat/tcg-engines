import type { EventCard } from "@tcg/op-types";
import { prb02GumGumJetGatlingReprint072I18n } from "./072-gum-gum-jet-gatling-reprint.i18n.ts";

export const prb02GumGumJetGatlingReprint072: EventCard = {
  id: "OP03-072",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "PRB02",
  cost: 0,
  traits: ["Straw Hat Crew Water Seven"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-072_p1.jpg",
      imageId: "OP03-072_p1",
    },
  ],
  effect:
    '[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle.[Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: prb02GumGumJetGatlingReprint072I18n,
};
