import type { ItemCard } from "@tcg/lorcana-types";
import { signedContract as canonicalSignedContract } from "../../004";

export const signedContract: ItemCard = {
  ...canonicalSignedContract,
  id: "Ntp",
  reprints: ["set4-099", "set9-101"],
  set: "009",
  cardNumber: 101,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_ebe4a26a2312422db81dc2b43198f159",
    tcgPlayer: 650039,
  },
};
