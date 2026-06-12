import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanEliteArcher } from "./114-mulan-elite-archer";

export const mulanEliteArcherEpic: CharacterCard = {
  ...mulanEliteArcher,
  id: "v22",
  reprints: ["set4-114", "set9-126"],
  set: "004",
  cardNumber: 224,
  rarity: "legendary",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_44fe3bead4bf40f79163468a4fd647e5",
    tcgPlayer: 650061,
  },
};
