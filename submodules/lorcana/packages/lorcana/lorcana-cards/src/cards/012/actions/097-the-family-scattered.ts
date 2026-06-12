import type { ActionCard } from "@tcg/lorcana-types";
import { theFamilyScatteredI18n } from "./097-the-family-scattered.i18n";

export const theFamilyScattered: ActionCard = {
  id: "idk",
  canonicalId: "ci_idk",
  reprints: ["set12-097"],
  cardType: "action",
  name: "The Family Scattered",
  inkType: ["emerald"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 97,
  rarity: "common",
  cost: 8,
  inkable: false,
  externalIds: {
    lorcast: "crd_dfd21b18ff8e4b118d94ee09db759671",
  },
  text: "Chosen opponent chooses 3 of their characters and returns one of those cards to their hand, puts one on the bottom of their deck, and puts one on the top of their deck.",
  abilities: [
    {
      type: "action",
      text: "Chosen opponent chooses 3 of their characters and returns one of those cards to their hand, puts one on the bottom of their deck, and puts one on the top of their deck.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "put-on-bottom",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "put-on-top",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
    },
  ],
  i18n: theFamilyScatteredI18n,
};
