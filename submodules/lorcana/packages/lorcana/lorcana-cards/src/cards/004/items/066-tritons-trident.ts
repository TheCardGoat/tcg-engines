import type { ItemCard } from "@tcg/lorcana-types";
import { tritonsTridentI18n } from "./066-tritons-trident.i18n";

export const tritonsTrident: ItemCard = {
  id: "xKb",
  canonicalId: "ci_xKb",
  reprints: ["set4-066"],
  cardType: "item",
  name: "Triton's Trident",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 66,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_57067560f7f0499da43dd94731e85552",
    tcgPlayer: 543911,
  },
  text: [
    {
      title: "SYMBOL OF POWER",
      description:
        "Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        duration: "this-turn",
        modifier: {
          type: "cards-in-hand",
          controller: "you",
        },
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "l9u-1",
      name: "SYMBOL OF POWER",
      text: "SYMBOL OF POWER Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
      type: "activated",
    },
  ],
  i18n: tritonsTridentI18n,
};
