import type { ActionCard } from "@tcg/lorcana-types";
import { powerSurgeI18n } from "./166-power-surge.i18n";

export const powerSurge: ActionCard = {
  id: "qAT",
  canonicalId: "ci_qAT",
  slug: "lorcana-ci_qAT",
  printings: [
    {
      id: "set13-166",
      artId: "set13-166",
      setCode: "set13",
      collectorNumber: "166",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-166"],
  cardType: "action",
  name: "Power Surge",
  inkType: ["sapphire"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 166,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  text: "Each player puts the top 2 cards of their deck into their inkwell facedown and exerted.",
  abilities: [
    {
      type: "action",
      text: "Each player puts the top 2 cards of their deck into their inkwell facedown and exerted.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "put-into-inkwell",
            source: "top-of-deck",
            target: "EACH_PLAYER",
            facedown: true,
            exerted: true,
          },
          {
            type: "put-into-inkwell",
            source: "top-of-deck",
            target: "EACH_PLAYER",
            facedown: true,
            exerted: true,
          },
        ],
      },
    },
  ],
  i18n: powerSurgeI18n,
};
