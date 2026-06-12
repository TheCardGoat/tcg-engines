import type { ActionCard } from "@tcg/lorcana-types";
import { developYourBrain as canonicalDevelopYourBrain } from "../../001";

export const developYourBrain: ActionCard = {
  ...canonicalDevelopYourBrain,
  id: "Ylr",
  reprints: ["set1-161", "set9-163"],
  set: "009",
  cardNumber: 163,
  rarity: "common",
  externalIds: {
    lorcast: "crd_441f1bb9f8c2478d84c13e70dd62755c",
    tcgPlayer: 650097,
  },
};
