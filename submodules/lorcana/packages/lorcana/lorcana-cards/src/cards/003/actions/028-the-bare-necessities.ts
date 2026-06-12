import type { ActionCard } from "@tcg/lorcana-types";
import { theBareNecessitiesI18n } from "./028-the-bare-necessities.i18n";

export const theBareNecessities: ActionCard = {
  id: "chI",
  canonicalId: "ci_chI",
  reprints: ["set3-028"],
  cardType: "action",
  name: "The Bare Necessities",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "003",
  cardNumber: 28,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_54e5e880c70e4e2bb68cc318a7d47e34",
    tcgPlayer: 538224,
  },
  text: "Chosen opponent reveals their hand and discards a non-character card of your choice.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Chosen opponent reveals their hand and discards a non-character card of your choice.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "you",
            filter: {
              notCardType: "character",
            },
          },
        ],
      },
    },
  ],
  i18n: theBareNecessitiesI18n,
};
