import type { CharacterCard } from "@tcg/lorcana-types";
import { louieChillNephew as canonicalLouieChillNephew } from "../../003";

export const louieChillNephew: CharacterCard = {
  ...canonicalLouieChillNephew,
  id: "US6",
  reprints: ["set3-149", "set9-140"],
  set: "009",
  cardNumber: 140,
  rarity: "common",
  externalIds: {
    lorcast: "crd_f81fa2c1489a44eab54bd8e0528cc202",
    tcgPlayer: 650075,
  },
};
