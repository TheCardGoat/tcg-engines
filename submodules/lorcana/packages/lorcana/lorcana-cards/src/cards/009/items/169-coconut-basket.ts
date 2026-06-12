import type { ItemCard } from "@tcg/lorcana-types";
import { coconutBasket as canonicalCoconutBasket } from "../../001";

export const coconutBasket: ItemCard = {
  ...canonicalCoconutBasket,
  id: "X1y",
  reprints: ["set1-166", "set9-169"],
  set: "009",
  cardNumber: 169,
  rarity: "common",
  externalIds: {
    lorcast: "crd_a175d05b419e4250bd62273eeb6d48c5",
    tcgPlayer: 650103,
  },
};
