import type { ItemCard } from "@tcg/lorcana-types";
import { magicMirror as canonicalMagicMirror } from "../../001";

export const magicMirror: ItemCard = {
  ...canonicalMagicMirror,
  id: "TPJ",
  reprints: ["set1-066", "set9-065"],
  set: "009",
  cardNumber: 65,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_d0073192de544630825d3b25614fcd12",
    tcgPlayer: 650008,
  },
};
