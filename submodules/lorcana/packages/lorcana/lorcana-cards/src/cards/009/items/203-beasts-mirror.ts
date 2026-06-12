import type { ItemCard } from "@tcg/lorcana-types";
import { beastsMirror as canonicalBeastsMirror } from "../../001";

export const beastsMirror: ItemCard = {
  ...canonicalBeastsMirror,
  id: "1jr",
  reprints: ["set1-201", "set9-203"],
  set: "009",
  cardNumber: 203,
  rarity: "common",
  externalIds: {
    lorcast: "crd_d23121463b6b482ab4af10faa55ba4ba",
    tcgPlayer: 650135,
  },
};
