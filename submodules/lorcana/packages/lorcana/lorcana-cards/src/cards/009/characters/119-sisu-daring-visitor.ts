import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuDaringVisitor as canonicalSisuDaringVisitor } from "../../004";

export const sisuDaringVisitor: CharacterCard = {
  ...canonicalSisuDaringVisitor,
  id: "dPe",
  reprints: ["set4-123", "set9-119"],
  set: "009",
  cardNumber: 119,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_76066fccc9724d34b6e7a238e52bee61",
    tcgPlayer: 650055,
  },
};
