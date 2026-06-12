import type { ItemCard } from "@tcg/lorcana-types";
import { retrosphereI18n } from "./064-retrosphere.i18n";

export const retrosphere: ItemCard = {
  id: "LA9",
  canonicalId: "ci_LA9",
  reprints: ["set5-064"],
  cardType: "item",
  name: "Retrosphere",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 64,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0aa70773df3a4f87ab5b96825787497d",
    tcgPlayer: 561475,
  },
  text: [
    {
      title: "EXTRACT OF AMETHYST 2",
      description:
        "{I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 2,
        banishSelf: true,
      },
      effect: {
        target: {
          cardTypes: ["character", "item", "location"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 3,
            },
          ],
        },
        type: "return-to-hand",
      },
      id: "u85-1",
      name: "EXTRACT OF AMETHYST 2",
      text: "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.",
      type: "activated",
    },
  ],
  i18n: retrosphereI18n,
};
