import type { ItemCard } from "@tcg/lorcana-types";
import { croquetMalletI18n } from "./066-croquet-mallet.i18n";

export const croquetMallet: ItemCard = {
  id: "Jp2",
  canonicalId: "ci_Jp2",
  reprints: ["set2-066"],
  cardType: "item",
  name: "Croquet Mallet",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 66,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_2f8f2276cb254195b2abf5cffd2b8193",
    tcgPlayer: 527741,
  },
  text: [
    {
      title: "HURTLING HEDGEHOG",
      description:
        "Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "1s8-1",
      name: "HURTLING HEDGEHOG",
      text: "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn.",
      type: "activated",
    },
  ],
  i18n: croquetMalletI18n,
};
