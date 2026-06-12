import type { ActionCard } from "@tcg/lorcana-types";
import { makeThePotion as canonicalMakeThePotion } from "../../004";

export const makeThePotion: ActionCard = {
  ...canonicalMakeThePotion,
  id: "gbt",
  reprints: ["set4-094", "set9-098"],
  set: "009",
  cardNumber: 98,
  rarity: "common",
  externalIds: {
    lorcast: "crd_5ecd4f8d0e8f44f8bda2b3986c6da49a",
    tcgPlayer: 650036,
  },
};
