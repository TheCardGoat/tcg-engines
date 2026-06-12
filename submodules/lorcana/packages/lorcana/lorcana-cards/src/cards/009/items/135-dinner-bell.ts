import type { ItemCard } from "@tcg/lorcana-types";
import { dinnerBell as canonicalDinnerBell } from "../../002";

export const dinnerBell: ItemCard = {
  ...canonicalDinnerBell,
  id: "j0O",
  reprints: ["set2-134", "set9-135"],
  set: "009",
  cardNumber: 135,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_205f1fdf160e42a4837e5d9ca8759f45",
    tcgPlayer: 650070,
  },
};
