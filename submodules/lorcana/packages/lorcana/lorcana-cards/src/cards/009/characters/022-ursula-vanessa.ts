import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaVanessa as canonicalUrsulaVanessa } from "../../004";

export const ursulaVanessa: CharacterCard = {
  ...canonicalUrsulaVanessa,
  id: "0pB",
  reprints: ["set4-025", "set9-022"],
  set: "009",
  cardNumber: 22,
  rarity: "common",
  externalIds: {
    lorcast: "crd_357824b1398340d8979b1ead1c7ff44f",
    tcgPlayer: 649970,
  },
};
