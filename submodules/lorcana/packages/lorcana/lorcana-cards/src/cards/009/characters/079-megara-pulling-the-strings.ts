import type { CharacterCard } from "@tcg/lorcana-types";
import { megaraPullingTheStrings as canonicalMegaraPullingTheStrings } from "../../001";

export const megaraPullingTheStrings: CharacterCard = {
  ...canonicalMegaraPullingTheStrings,
  id: "3Za",
  reprints: ["set1-087", "set9-079"],
  set: "009",
  cardNumber: 79,
  rarity: "common",
  externalIds: {
    lorcast: "crd_bac12540d0734d2080c8cac9d19265d7",
    tcgPlayer: 650019,
  },
};
