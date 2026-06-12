import type { ItemCard } from "@tcg/lorcana-types";
import { swordOfTruthI18n } from "./136-sword-of-truth.i18n";

export const swordOfTruth: ItemCard = {
  id: "4Du",
  canonicalId: "ci_4Du",
  reprints: ["set1-136"],
  cardType: "item",
  name: "Sword of Truth",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 136,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_19c135ff62f2427d93b3131114b4c10b",
    tcgPlayer: 508793,
  },
  text: [
    {
      title: "FINAL ENCHANTMENT",
      description: "Banish this item — Banish chosen Villain character.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Villain",
            },
          ],
        },
        type: "banish",
      },
      id: "1mo-1",
      name: "FINAL ENCHANTMENT",
      text: "FINAL ENCHANTMENT Banish this item — Banish chosen Villain character.",
      type: "activated",
    },
  ],
  i18n: swordOfTruthI18n,
};
