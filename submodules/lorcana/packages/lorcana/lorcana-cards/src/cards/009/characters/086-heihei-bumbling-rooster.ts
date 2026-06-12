import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiBumblingRooster as canonicalHeiheiBumblingRooster } from "../../004";

export const heiheiBumblingRooster: CharacterCard = {
  ...canonicalHeiheiBumblingRooster,
  id: "gv1",
  reprints: ["set4-075", "set9-086"],
  set: "009",
  cardNumber: 86,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_fe534ba2bc92411385d7176097db4f43",
    tcgPlayer: 650026,
  },
};
