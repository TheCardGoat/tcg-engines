import type { ActionCard } from "@tcg/lorcana-types";
import { lookAtThisFamilyI18n } from "./028-look-at-this-family.i18n";

export const lookAtThisFamily: ActionCard = {
  id: "U4j",
  canonicalId: "ci_ClP",
  reprints: ["set4-028", "set9-025"],
  cardType: "action",
  name: "Look at This Family",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 28,
  rarity: "rare",
  cost: 7,
  inkable: true,
  externalIds: {
    lorcast: "crd_c8a627814d404f46ad87c09ece866017",
    tcgPlayer: 649973,
  },
  text: [
    {
      title: "Sing Together 7",
      description:
        "(Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "scry",
        amount: 5,
        target: "CONTROLLER",
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
      },
    },
  ],
  i18n: lookAtThisFamilyI18n,
};
