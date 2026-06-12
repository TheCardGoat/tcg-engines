import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanInjuredSoldier as canonicalMulanInjuredSoldier } from "../../004";

export const mulanInjuredSoldier: CharacterCard = {
  ...canonicalMulanInjuredSoldier,
  id: "yMt",
  reprints: ["set4-116", "set9-125"],
  set: "009",
  cardNumber: 125,
  rarity: "common",
  externalIds: {
    lorcast: "crd_2acf4a3090844ac6a8e091f806c28aed",
    tcgPlayer: 650060,
  },
};
