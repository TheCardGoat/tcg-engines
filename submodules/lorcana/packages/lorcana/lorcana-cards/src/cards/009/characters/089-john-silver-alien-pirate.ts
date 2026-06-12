import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverAlienPirate as canonicalJohnSilverAlienPirate } from "../../001";

export const johnSilverAlienPirate: CharacterCard = {
  ...canonicalJohnSilverAlienPirate,
  id: "a2V",
  reprints: ["set1-082", "set9-089"],
  set: "009",
  cardNumber: 89,
  rarity: "legendary",
  externalIds: {
    lorcast: "crd_e775c2ea351d4c3ca09630ade10092de",
    tcgPlayer: 647668,
  },
};
