import type { ActionCard } from "@tcg/lorcana-types";
import { sailTheAzuriteSeaI18n } from "./163-sail-the-azurite-sea.i18n";

export const sailTheAzuriteSea: ActionCard = {
  id: "EfC",
  canonicalId: "ci_EfC",
  reprints: ["set6-163"],
  cardType: "action",
  name: "Sail the Azurite Sea",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "006",
  cardNumber: 163,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_049739e69c034e898c3c48abd37544cc",
    tcgPlayer: 592008,
  },
  text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "additional-inkwell",
            amount: 1,
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
      },
    },
  ],
  i18n: sailTheAzuriteSeaI18n,
};
