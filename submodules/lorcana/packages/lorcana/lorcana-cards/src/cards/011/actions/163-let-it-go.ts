import type { ActionCard } from "@tcg/lorcana-types";
import { letItGo as canonicalLetItGo } from "../../001";

export const letItGo: ActionCard = {
  ...canonicalLetItGo,
  id: "20T",
  reprints: ["set1-163", "set11-163"],
  set: "011",
  cardNumber: 163,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_7e294ae586f24eddae3b7d1263c73ee7",
    tcgPlayer: 674692,
  },
};
