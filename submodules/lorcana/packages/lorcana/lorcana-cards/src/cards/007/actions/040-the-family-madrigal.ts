import type { ActionCard } from "@tcg/lorcana-types";
import { theFamilyMadrigalI18n } from "./040-the-family-madrigal.i18n";

export const theFamilyMadrigal: ActionCard = {
  id: "QHV",
  canonicalId: "ci_QHV",
  reprints: ["set7-040"],
  cardType: "action",
  name: "The Family Madrigal",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "007",
  cardNumber: 40,
  rarity: "rare",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_c6cad61cbf8445be93e29134eb073af6",
    tcgPlayer: 619429,
  },
  text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        amount: 5,
        destinations: [
          {
            filter: {
              type: "and",
              filters: [
                {
                  type: "card-type",
                  cardType: "character",
                },
                {
                  type: "classification",
                  classification: "Madrigal",
                },
              ],
            },
            label: "Hand (Madrigal character)",
            max: 1,
            min: 0,
            reveal: true,
            zone: "hand",
          },
          {
            filter: {
              type: "song",
            },
            label: "Hand (Song)",
            max: 1,
            min: 0,
            reveal: true,
            zone: "hand",
          },
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-top",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      type: "action",
    },
  ],
  i18n: theFamilyMadrigalI18n,
};
