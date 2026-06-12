import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesInfernalSchemer as canonicalHadesInfernalSchemer } from "../../001";

export const hadesInfernalSchemer: CharacterCard = {
  ...canonicalHadesInfernalSchemer,
  id: "oD3",
  reprints: ["set1-147", "set9-151"],
  set: "009",
  cardNumber: 151,
  rarity: "legendary",
  externalIds: {
    lorcast: "crd_050ae6da90154532905911c8c2569802",
    tcgPlayer: 651117,
  },
};
