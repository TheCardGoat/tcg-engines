import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHunnyWizard as canonicalWinnieThePoohHunnyWizard } from "../../002";

export const winnieThePoohHunnyWizard: CharacterCard = {
  ...canonicalWinnieThePoohHunnyWizard,
  id: "PZk",
  reprints: ["set2-059", "set9-041"],
  set: "009",
  cardNumber: 41,
  rarity: "common",
  externalIds: {
    lorcast: "crd_69d9b22e10244e2fb65ffbdb5f99da83",
    tcgPlayer: 651107,
  },
};
