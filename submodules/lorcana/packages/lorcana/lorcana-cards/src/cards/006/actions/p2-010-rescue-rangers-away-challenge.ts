import type { ActionCard } from "@tcg/lorcana-types";
import { rescueRangersAwayP2ChallengeI18n } from "./p2-010-rescue-rangers-away-challenge.i18n";

export const rescueRangersAwayP2Challenge: ActionCard = {
  id: "dYr",
  canonicalId: "ci_kMt",
  slug: "lorcana-ci_kMt",
  printings: [
    {
      id: "set6-p2-010-challenge",
      artId: "ci_kMt-challenge",
      setCode: "set6",
      collectorNumber: "10",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set6-029"],
  cardType: "action",
  name: "Rescue Rangers Away!",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 10,
  rarity: "special",
  specialRarity: "challenge",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_be7a93b4b99b4a8b9da63fd956fa3c86",
    tcgPlayer: "578172",
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
  i18n: rescueRangersAwayP2ChallengeI18n,
};
