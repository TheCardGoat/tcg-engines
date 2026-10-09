import type { ActionCard } from "@tcg/lorcana-types";
import { scramI18n } from "./165-scram.i18n";

export const scram: ActionCard = {
  id: "PdU",
  canonicalId: "ci_PdU",
  slug: "lorcana-ci_PdU",
  printings: [
    {
      id: "set14-165",
      artId: "set14-165",
      setCode: "set14",
      collectorNumber: "165",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-165"],
  cardType: "action",
  name: "Scram!",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 165,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fbad04e914b74e78958db0a46870584d",
  },
  text: "Put chosen opposing character with cost 2 or less into their player's inkwell facedown and exerted.",
  abilities: [
    {
      type: "action",
      text: "Put chosen opposing character with cost 2 or less into their player's inkwell facedown and exerted.",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: scramI18n,
};
