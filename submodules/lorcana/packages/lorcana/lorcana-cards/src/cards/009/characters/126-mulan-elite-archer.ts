import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanEliteArcher as canonicalMulanEliteArcher } from "../../004";

export const mulanEliteArcher: CharacterCard = {
  ...canonicalMulanEliteArcher,
  id: "617",
  reprints: ["set4-114", "set9-126"],
  set: "009",
  cardNumber: 126,
  rarity: "common",
  externalIds: {
    lorcast: "crd_44fe3bead4bf40f79163468a4fd647e5",
    tcgPlayer: 650061,
  },
};
