import type { ItemCard } from "@tcg/lorcana-types";
import { heartOfTeFiti as canonicalHeartOfTeFiti } from "../../003";

export const heartOfTeFiti: ItemCard = {
  ...canonicalHeartOfTeFiti,
  id: "u0k",
  reprints: ["set3-164", "set9-168"],
  set: "009",
  cardNumber: 168,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_81cea9b9222c496a8de13d5eb3215ab2",
    tcgPlayer: 650102,
  },
};
