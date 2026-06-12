import type { ActionCard } from "@tcg/lorcana-types";
import { begoneI18n } from "./061-begone.i18n";

export const begone: ActionCard = {
  id: "zPN",
  canonicalId: "ci_zPN",
  reprints: ["set10-061"],
  cardType: "action",
  name: "Begone!",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "010",
  cardNumber: 61,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_34f44dc8dcef41ba9b4c4f23f9720ff6",
    tcgPlayer: 659420,
  },
  text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character", "item", "location"],
          count: 1,
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 3,
            },
          ],
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "return-to-hand",
      },
      type: "action",
    },
  ],
  i18n: begoneI18n,
};
