import type { ActionCard } from "@tcg/lorcana-types";
import { beyondTheHorizonI18n } from "./202-beyond-the-horizon.i18n";

export const beyondTheHorizon: ActionCard = {
  id: "hIs",
  canonicalId: "ci_hIs",
  reprints: ["set8-202"],
  cardType: "action",
  name: "Beyond the Horizon",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "008",
  cardNumber: 202,
  rarity: "uncommon",
  cost: 7,
  inkable: false,
  externalIds: {
    lorcast: "crd_b653851369d8432198a23d09e7642dbd",
    tcgPlayer: 631483,
  },
  text: [
    {
      title: "Sing Together 7",
      description:
        "(Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.)",
    },
    {
      title: "Choose any number of players. They discard their hands and draw 3 cards each.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        type: "choice",
        optionLabels: [
          "All players discard their hands and draw 3 cards",
          "You discard your hand and draw 3 cards",
          "Chosen opponent discards their hand and draws 3 cards",
        ],
        options: [
          {
            type: "sequence",
            steps: [
              {
                type: "discard",
                amount: "all",
                target: "ALL_PLAYERS",
              },
              {
                type: "draw",
                amount: 3,
                target: "ALL_PLAYERS",
              },
            ],
          },
          {
            type: "sequence",
            steps: [
              {
                type: "discard",
                amount: "all",
                target: "CONTROLLER",
              },
              {
                type: "draw",
                amount: 3,
                target: "CONTROLLER",
              },
            ],
          },
          {
            type: "sequence",
            steps: [
              {
                type: "discard",
                amount: "all",
                target: "OPPONENT",
              },
              {
                type: "draw",
                amount: 3,
                target: "OPPONENT",
              },
            ],
          },
        ],
      },
      type: "action",
    },
  ],
  i18n: beyondTheHorizonI18n,
};
