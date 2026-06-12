import type { ActionCard } from "@tcg/lorcana-types";
import { smash as canonicalSmash } from "../../001";

export const smash: ActionCard = {
  ...canonicalSmash,
  id: "vCv",
  reprints: ["set1-200", "set9-198"],
  set: "009",
  cardNumber: 198,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_108a4980fc8d4e3f84faf7b7ffc18cc0",
    tcgPlayer: 650131,
  },
};
