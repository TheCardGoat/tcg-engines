import type { ActionCard } from "@tcg/lorcana-types";
import { ohanaMeansFamilyI18n } from "./032-ohana-means-family.i18n";

export const ohanaMeansFamily: ActionCard = {
  id: "w65",
  canonicalId: "ci_iVN",
  reprints: ["set11-032"],
  cardType: "action",
  name: "Ohana Means Family",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 32,
  rarity: "legendary",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_87abaabc59344ef1bfed548f0b6753bf",
    tcgPlayer: 673068,
  },
  text: "Remove all damage from chosen character of yours. Draw a card for each 1 damage removed this way.",
  abilities: [
    {
      type: "action",
      text: "Remove all damage from chosen character of yours. Draw a card for each 1 damage removed this way.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: 99,
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: {
              type: "for-each",
              counter: {
                type: "damage-removed",
              },
            },
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: ohanaMeansFamilyI18n,
};
