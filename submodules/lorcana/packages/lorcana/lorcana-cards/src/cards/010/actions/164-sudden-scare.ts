import type { ActionCard } from "@tcg/lorcana-types";
import { suddenScareI18n } from "./164-sudden-scare.i18n";

export const suddenScare: ActionCard = {
  id: "U5K",
  canonicalId: "ci_zXX",
  reprints: ["set10-164"],
  cardType: "action",
  name: "Sudden Scare",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 164,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_7101d6f7aaba488e9a508b0d40172743",
    tcgPlayer: 660271,
  },
  text: "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.",
  abilities: [
    {
      effect: {
        steps: [
          {
            facedown: true,
            source: "chosen-character",
            target: "CHOSEN_CHARACTER",
            type: "put-into-inkwell",
          },
          {
            facedown: true,
            source: "top-of-deck",
            target: "OPPONENT",
            type: "put-into-inkwell",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: suddenScareI18n,
};
