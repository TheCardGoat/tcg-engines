import type { ActionCard } from "@tcg/lorcana-types";
import { wipeOutI18n } from "./165-wipe-out.i18n";

export const wipeOut: ActionCard = {
  id: "5P4",
  canonicalId: "ci_5P4",
  reprints: ["set11-165"],
  cardType: "action",
  name: "Wipe Out!",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 165,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0d28e0cfc9ea44d4a568fa034fc67dbd",
    tcgPlayer: 676229,
  },
  text: "Put chosen character with Bodyguard or item into their player's inkwell facedown and exerted.",
  abilities: [
    {
      type: "action",
      text: "Put chosen character with Bodyguard or item into their player's inkwell facedown and exerted.",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-card-in-play",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character", "item"],
          filter: [
            {
              type: "or",
              filters: [
                {
                  type: "card-type",
                  value: "item",
                },
                {
                  type: "and",
                  filters: [
                    {
                      type: "card-type",
                      value: "character",
                    },
                    {
                      type: "has-keyword",
                      keyword: "Bodyguard",
                    },
                  ],
                },
              ],
            },
          ],
        },
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: wipeOutI18n,
};
