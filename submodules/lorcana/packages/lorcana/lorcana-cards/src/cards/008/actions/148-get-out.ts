import type { ActionCard } from "@tcg/lorcana-types";
import { getOutI18n } from "./148-get-out.i18n";

export const getOut: ActionCard = {
  id: "FWW",
  canonicalId: "ci_FWW",
  reprints: ["set8-148"],
  cardType: "action",
  name: "Get Out!",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  cardNumber: 148,
  rarity: "uncommon",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_f0f2c6f11556497abc5ada3ae5fabe5c",
    tcgPlayer: 631448,
  },
  text: "Banish chosen character, then return an item card from your discard to your hand.",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "banish",
          },
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["discard"],
              cardTypes: ["item"],
            },
            type: "return-to-hand",
          },
        ],
        type: "sequence",
      },
      id: "rmf-1",
      text: "Banish chosen character, then return an item card from your discard to your hand.",
      type: "action",
    },
  ],
  i18n: getOutI18n,
};
