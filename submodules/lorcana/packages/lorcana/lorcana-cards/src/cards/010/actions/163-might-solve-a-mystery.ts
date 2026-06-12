import type { ActionCard } from "@tcg/lorcana-types";
import { mightSolveAMysteryI18n } from "./163-might-solve-a-mystery.i18n";

export const mightSolveAMystery: ActionCard = {
  id: "lhB",
  canonicalId: "ci_lhB",
  reprints: ["set10-163"],
  cardType: "action",
  name: "Might Solve a Mystery",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 163,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_3f49acb68d7d44f4a8f98b555b7e47dd",
    tcgPlayer: 658459,
  },
  text: "Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        amount: 4,
        destinations: [
          {
            filter: {
              type: "card-type",
              cardType: "character",
            },
            max: 1,
            reveal: true,
            zone: "hand",
          },
          {
            filter: {
              type: "card-type",
              cardType: "item",
            },
            max: 1,
            reveal: true,
            zone: "hand",
          },
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-bottom",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      type: "action",
    },
  ],
  i18n: mightSolveAMysteryI18n,
};
