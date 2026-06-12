import type { ActionCard } from "@tcg/lorcana-types";
import { weKnowTheWayI18n } from "./061-we-know-the-way.i18n";

export const weKnowTheWay: ActionCard = {
  id: "2Wp",
  canonicalId: "ci_2Wp",
  reprints: ["set5-061"],
  cardType: "action",
  name: "We Know the Way",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "005",
  cardNumber: 61,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_74fab45eaa32470b9ca3c830ab920f93",
    tcgPlayer: 560658,
  },
  text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["discard"],
            },
            type: "shuffle-into-deck",
          },
          {
            type: "reveal-and-route",
            target: "CONTROLLER",
            routes: [
              {
                condition: { type: "revealed-matches-chosen-name" },
                destination: { zone: "play", cost: "free" },
                optional: true,
              },
            ],
            fallback: { zone: "hand" },
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: weKnowTheWayI18n,
};
