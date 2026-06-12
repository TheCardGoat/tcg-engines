import type { ActionCard } from "@tcg/lorcana-types";
import { lastditchEffort as canonicalLastditchEffort } from "../../003";

export const lastditchEffort: ActionCard = {
  ...canonicalLastditchEffort,
  id: "gMk",
  reprints: ["set3-062", "set9-062"],
  set: "009",
  cardNumber: 62,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_1b909f18bf5e43948a2f59d32a9dbaa7",
    tcgPlayer: 650006,
  },
};
