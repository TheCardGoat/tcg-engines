import type { CharacterCard } from "@tcg/lorcana-types";
import { maxGoofRockinTeen } from "./112-max-goof-rockin-teen";

export const maxGoofRockinTeenEpic: CharacterCard = {
  ...maxGoofRockinTeen,
  id: "3FW",
  reprints: ["set9-112"],
  set: "009",
  cardNumber: 214,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_4d1c2c4913d1417294da21592cee8363",
    tcgPlayer: 650150,
  },
};
