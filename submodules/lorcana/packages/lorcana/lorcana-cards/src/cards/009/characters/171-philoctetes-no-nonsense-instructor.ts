import type { CharacterCard } from "@tcg/lorcana-types";
import { philoctetesNononsenseInstructor as canonicalPhiloctetesNononsenseInstructor } from "../../004";

export const philoctetesNononsenseInstructor: CharacterCard = {
  ...canonicalPhiloctetesNononsenseInstructor,
  id: "ee3",
  reprints: ["set4-190", "set9-171"],
  set: "009",
  cardNumber: 171,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_f92eff31c1e24bb7802247c709840973",
    tcgPlayer: 650105,
  },
};
