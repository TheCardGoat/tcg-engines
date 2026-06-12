import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaGentleAndKind as canonicalCinderellaGentleAndKind } from "../../001";

export const cinderellaGentleAndKind: CharacterCard = {
  ...canonicalCinderellaGentleAndKind,
  id: "4II",
  reprints: ["set1-003", "set9-019"],
  set: "009",
  cardNumber: 19,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_0ae012bfcad54631949412a2947a8f7d",
    tcgPlayer: 649967,
  },
};
