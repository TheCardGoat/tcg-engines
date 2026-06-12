import type { CharacterCard } from "@tcg/lorcana-types";
import { tukTukLivelyPartner as canonicalTukTukLivelyPartner } from "../../004";

export const tukTukLivelyPartner: CharacterCard = {
  ...canonicalTukTukLivelyPartner,
  id: "WVh",
  reprints: ["set4-127", "set9-129"],
  set: "009",
  cardNumber: 129,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_1f37e8ef12cb407f815ee35eb21abf61",
    tcgPlayer: 650064,
  },
};
