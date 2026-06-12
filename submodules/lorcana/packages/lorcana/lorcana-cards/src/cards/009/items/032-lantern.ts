import type { ItemCard } from "@tcg/lorcana-types";
import { lantern as canonicalLantern } from "../../001";

export const lantern: ItemCard = {
  ...canonicalLantern,
  id: "XaO",
  reprints: ["set1-033", "set9-032"],
  set: "009",
  cardNumber: 32,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_c77ef321da53426c9f7d856202152b2e",
    tcgPlayer: 649979,
  },
};
