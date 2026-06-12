import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraWakingBeauty } from "./014-aurora-waking-beauty";

export const auroraWakingBeautyEnchanted: CharacterCard = {
  ...auroraWakingBeauty,
  id: "ALL",
  reprints: ["set7-014"],
  set: "007",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_54102dba80604a609eed679b7f33fad3",
    tcgPlayer: 619733,
  },
};
