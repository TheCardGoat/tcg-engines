import type { CharacterCard } from "@tcg/lorcana-types";
import { belleUntrainedMystic as canonicalBelleUntrainedMystic } from "../../004";

export const belleUntrainedMystic: CharacterCard = {
  ...canonicalBelleUntrainedMystic,
  id: "fiU",
  reprints: ["set4-037", "set9-039"],
  set: "009",
  cardNumber: 39,
  rarity: "common",
  externalIds: {
    lorcast: "crd_53d3d0830c344ef08b076c3aada0afa6",
    tcgPlayer: 649986,
  },
};
