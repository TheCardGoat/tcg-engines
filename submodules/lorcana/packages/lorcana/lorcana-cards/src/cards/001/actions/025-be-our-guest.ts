import type { ActionCard } from "@tcg/lorcana-types";
import { beOurGuestI18n } from "./025-be-our-guest.i18n";

export const beOurGuest: ActionCard = {
  id: "nXA",
  canonicalId: "ci_XYl",
  reprints: ["set1-025", "set9-031"],
  cardType: "action",
  name: "Be Our Guest",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 25,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ecf737e88516492c9592efb0c0b6da85",
    tcgPlayer: 649978,
  },
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
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
            max: 1,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "character",
            },
          },
          {
            ordering: "player-choice",
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
    },
  ],
  i18n: beOurGuestI18n,
};
