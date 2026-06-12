import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentMonstrousDragon as canonicalMaleficentMonstrousDragon } from "../../001";

export const maleficentMonstrousDragon: CharacterCard = {
  ...canonicalMaleficentMonstrousDragon,
  id: "N2j",
  reprints: ["set1-113", "set9-108"],
  set: "009",
  cardNumber: 108,
  rarity: "legendary",
  externalIds: {
    lorcast: "crd_331c3ce2f2a74490acc4b2bec16a0ad9",
    tcgPlayer: 650046,
  },
};
