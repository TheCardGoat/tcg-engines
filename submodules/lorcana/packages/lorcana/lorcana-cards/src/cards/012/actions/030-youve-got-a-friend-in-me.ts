import type { ActionCard } from "@tcg/lorcana-types";
import { youveGotAFriendInMeI18n } from "./030-youve-got-a-friend-in-me.i18n";

export const youveGotAFriendInMe: ActionCard = {
  id: "U0Y",
  canonicalId: "ci_U0Y",
  reprints: ["set12-030"],
  cardType: "action",
  name: "You've Got a Friend in Me",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 30,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_611ab7622d0b4aa7a9aa98ab736f329c",
  },
  text: "Look at the top 4 cards of your deck. You may reveal up to 2 Toy character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "scry",
        amount: 4,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 2,
            reveal: true,
            filter: {
              type: "and",
              filters: [
                {
                  type: "card-type",
                  cardType: "character",
                },
                {
                  type: "classification",
                  classification: "Toy",
                },
              ],
            },
            label: "Hand (Toy character)",
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: youveGotAFriendInMeI18n,
};
