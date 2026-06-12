import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuEmboldenedWarrior as canonicalSisuEmboldenedWarrior } from "../../004";

export const sisuEmboldenedWarrior: CharacterCard = {
  ...canonicalSisuEmboldenedWarrior,
  id: "mUL",
  reprints: ["set4-124", "set9-118"],
  set: "009",
  cardNumber: 118,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_03cbb7961ddc4db7b724f1a934e1114b",
    tcgPlayer: 650054,
  },
};
