import type { ActionCard } from "@tcg/lorcana-types";
import { rescueRangersAwayI18n } from "./029-rescue-rangers-away.i18n";

export const rescueRangersAway: ActionCard = {
  id: "wx1",
  canonicalId: "ci_wx1",
  reprints: ["set6-029"],
  cardType: "action",
  name: "Rescue Rangers Away!",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 29,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_be7a93b4b99b4a8b9da63fd956fa3c86",
    tcgPlayer: 578172,
  },
  text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        target: "CHOSEN_CHARACTER",
        stat: "strength",
        duration: "until-start-of-next-turn",
        modifier: {
          type: "difference",
          left: 0,
          right: {
            type: "characters-in-play",
            controller: "you",
          },
        },
      },
    },
  ],
  i18n: rescueRangersAwayI18n,
};
