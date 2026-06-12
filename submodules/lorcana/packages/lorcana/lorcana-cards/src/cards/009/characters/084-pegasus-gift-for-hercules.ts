import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusGiftForHercules as canonicalPegasusGiftForHercules } from "../../004";

export const pegasusGiftForHercules: CharacterCard = {
  ...canonicalPegasusGiftForHercules,
  id: "vEP",
  reprints: ["set4-084", "set9-084"],
  set: "009",
  cardNumber: 84,
  rarity: "common",
  externalIds: {
    lorcast: "crd_5623b1aaf330477aa9d14cd755597509",
    tcgPlayer: 650149,
  },
};
