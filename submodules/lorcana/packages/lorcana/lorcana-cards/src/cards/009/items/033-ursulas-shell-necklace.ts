import type { ItemCard } from "@tcg/lorcana-types";
import { ursulasShellNecklace as canonicalUrsulasShellNecklace } from "../../001";

export const ursulasShellNecklace: ItemCard = {
  ...canonicalUrsulasShellNecklace,
  id: "zpz",
  reprints: ["set1-034", "set9-033"],
  set: "009",
  cardNumber: 33,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_cfa8f36f7729492fa74fa256816c7f55",
    tcgPlayer: 649980,
  },
};
