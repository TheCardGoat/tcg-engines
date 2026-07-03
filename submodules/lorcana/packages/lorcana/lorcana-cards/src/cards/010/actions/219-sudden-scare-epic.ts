import type { ActionCard } from "@tcg/lorcana-types";
import { suddenScareEpicI18n } from "./219-sudden-scare-epic.i18n";

export const suddenScareEpic: ActionCard = {
  id: "MXq",
  canonicalId: "ci_zXX",
  slug: "lorcana-ci_zXX",
  printings: [
    {
      id: "set10-219-epic",
      artId: "ci_zXX-epic",
      setCode: "set10",
      collectorNumber: "219",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-164"],
  cardType: "action",
  name: "Sudden Scare",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 219,
  rarity: "common",
  specialRarity: "epic",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_7101d6f7aaba488e9a508b0d40172743",
    tcgPlayer: "660271",
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
  i18n: suddenScareEpicI18n,
};
