import type { ActionCard } from "@tcg/lorcana-types";
import { invitedToTheBallI18n } from "./029-invited-to-the-ball.i18n";

export const invitedToTheBall: ActionCard = {
  id: "20P",
  canonicalId: "ci_20P",
  reprints: ["set5-029"],
  cardType: "action",
  name: "Invited to the Ball",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "005",
  cardNumber: 29,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d544feda22c44e0e9fccb9936fb20202",
    tcgPlayer: 559086,
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
  i18n: invitedToTheBallI18n,
};
