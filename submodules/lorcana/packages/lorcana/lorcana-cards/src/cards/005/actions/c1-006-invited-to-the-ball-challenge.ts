import type { ActionCard } from "@tcg/lorcana-types";
import { invitedToTheBallC1ChallengeI18n } from "./c1-006-invited-to-the-ball-challenge.i18n";

export const invitedToTheBallC1Challenge: ActionCard = {
  id: "khY",
  canonicalId: "ci_20P",
  slug: "lorcana-ci_20P",
  printings: [
    {
      id: "set5-c1-006-challenge",
      artId: "ci_20P-challenge",
      setCode: "set5",
      collectorNumber: "6",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set5-029"],
  cardType: "action",
  name: "Invited to the Ball",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "005",
  cardNumber: 6,
  rarity: "special",
  specialRarity: "challenge",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d544feda22c44e0e9fccb9936fb20202",
    tcgPlayer: "559086",
  },
  text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
  abilities: [
    {
      effect: {
        amount: 2,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 2,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "character",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      id: "5ai-1",
      text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  i18n: invitedToTheBallC1ChallengeI18n,
};
