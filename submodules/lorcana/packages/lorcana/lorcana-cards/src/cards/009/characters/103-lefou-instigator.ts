import type { CharacterCard } from "@tcg/lorcana-types";
import { lefouInstigator as canonicalLefouInstigator } from "../../001";

export const lefouInstigator: CharacterCard = {
  ...canonicalLefouInstigator,
  id: "Tdt",
  reprints: ["set1-112", "set9-103"],
  set: "009",
  cardNumber: 103,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_f3852a9841064672acd078eb9d2220a1",
    tcgPlayer: 650041,
  },
};
