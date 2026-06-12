import type { ActionCard } from "@tcg/lorcana-types";
import { youCameBackI18n } from "./097-you-came-back.i18n";

export const youCameBack: ActionCard = {
  id: "A1c",
  canonicalId: "ci_wY5",
  reprints: ["set6-097"],
  cardType: "action",
  name: "You Came Back",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 97,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_b29e4a26e9324724aab37e97a7738476",
    tcgPlayer: 591998,
  },
  text: "Ready chosen character.",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "ready",
      },
      id: "1dw-1",
      text: "Ready chosen character.",
      type: "action",
    },
  ],
  i18n: youCameBackI18n,
};
