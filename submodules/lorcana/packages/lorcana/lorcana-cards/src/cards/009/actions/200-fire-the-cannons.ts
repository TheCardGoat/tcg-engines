import type { ActionCard } from "@tcg/lorcana-types";
import { fireTheCannons as canonicalFireTheCannons } from "../../001";

export const fireTheCannons: ActionCard = {
  ...canonicalFireTheCannons,
  id: "K4W",
  reprints: ["set1-197", "set9-200"],
  set: "009",
  cardNumber: 200,
  rarity: "common",
  externalIds: {
    lorcast: "crd_5056d5a4da8e4d9bb329620e1e77329b",
    tcgPlayer: 650133,
  },
};
