import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusGiftForHercules } from "../../004";

export const pegasusGiftForHerculesEpic: CharacterCard = {
  ...pegasusGiftForHercules,
  id: "fMf",
  reprints: ["set4-084", "set9-084"],
  set: "009",
  cardNumber: 212,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_5623b1aaf330477aa9d14cd755597509",
    tcgPlayer: 650149,
  },
};
