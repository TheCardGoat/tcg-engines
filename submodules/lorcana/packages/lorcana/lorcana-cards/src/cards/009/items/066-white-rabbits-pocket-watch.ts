import type { ItemCard } from "@tcg/lorcana-types";
import { whiteRabbitsPocketWatch as canonicalWhiteRabbitsPocketWatch } from "../../001";

export const whiteRabbitsPocketWatch: ItemCard = {
  ...canonicalWhiteRabbitsPocketWatch,
  id: "yLh",
  reprints: ["set1-068", "set9-066"],
  set: "009",
  cardNumber: 66,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_d483668415d54d07861f290ceebc0c38",
    tcgPlayer: 650009,
  },
};
