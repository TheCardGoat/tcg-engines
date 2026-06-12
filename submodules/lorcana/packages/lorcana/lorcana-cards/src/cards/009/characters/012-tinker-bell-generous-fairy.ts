import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellGenerousFairy as canonicalTinkerBellGenerousFairy } from "../../003";

export const tinkerBellGenerousFairy: CharacterCard = {
  ...canonicalTinkerBellGenerousFairy,
  id: "0S4",
  reprints: ["set3-022", "set9-012"],
  set: "009",
  cardNumber: 12,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_6ec58a64abf84ea2968667aa02d50769",
    tcgPlayer: 649961,
  },
};
