import type { ActionCard } from "@tcg/lorcana-types";
import { voyageI18n } from "./131-voyage.i18n";

export const voyage: ActionCard = {
  id: "Xj3",
  canonicalId: "ci_Xj3",
  reprints: ["set3-131"],
  cardType: "action",
  name: "Voyage",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  cardNumber: 131,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cc0c5bf9ccbf4884926461d06eed76b0",
    tcgPlayer: 537384,
  },
  text: "Move up to 2 characters of yours to the same location for free.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "move-to-location",
        cost: "free",
        character: {
          selector: "chosen",
          count: {
            upTo: 2,
          },
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
        location: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
    },
  ],
  i18n: voyageI18n,
};
